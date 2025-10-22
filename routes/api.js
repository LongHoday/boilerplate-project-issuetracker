'use strict';

// In-memory database để lưu trữ issues
const issues = {};

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      
      if (!issues[project]) {
        return res.json([]);
      }
      
      // Lấy các query parameters để filter
      let filteredIssues = issues[project].filter(issue => {
        for (let key in req.query) {
          // Chuyển đổi giá trị boolean từ string
          let queryValue = req.query[key];
          if (queryValue === 'true') queryValue = true;
          if (queryValue === 'false') queryValue = false;
          
          if (issue[key] != queryValue) {
            return false;
          }
        }
        return true;
      });
      
      res.json(filteredIssues);
    })
    
    .post(function (req, res){
      let project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      
      // Kiểm tra các trường bắt buộc
      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }
      
      // Tạo issue mới
      const newIssue = {
        _id: generateId(),
        issue_title,
        issue_text,
        created_by,
        assigned_to: assigned_to || '',
        status_text: status_text || '',
        created_on: new Date().toISOString(),
        updated_on: new Date().toISOString(),
        open: true
      };
      
      // Lưu issue vào database
      if (!issues[project]) {
        issues[project] = [];
      }
      issues[project].push(newIssue);
      
      res.json(newIssue);
    })
    
    .put(function (req, res){
      let project = req.params.project;
      const { _id, ...updateFields } = req.body;
      
      // Kiểm tra _id
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
      
      // Kiểm tra có trường nào để cập nhật không
      const validFields = ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'open'];
      const fieldsToUpdate = Object.keys(updateFields).filter(key => validFields.includes(key) && updateFields[key] !== '');
      
      if (fieldsToUpdate.length === 0) {
        return res.json({ error: 'no update field(s) sent', '_id': _id });
      }
      
      // Tìm và cập nhật issue
      if (!issues[project]) {
        return res.json({ error: 'could not update', '_id': _id });
      }
      
      const issueIndex = issues[project].findIndex(issue => issue._id === _id);
      
      if (issueIndex === -1) {
        return res.json({ error: 'could not update', '_id': _id });
      }
      
      // Cập nhật các trường
      fieldsToUpdate.forEach(field => {
        issues[project][issueIndex][field] = updateFields[field];
      });
      issues[project][issueIndex].updated_on = new Date().toISOString();
      
      res.json({ result: 'successfully updated', '_id': _id });
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      const { _id } = req.body;
      
      // Kiểm tra _id
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
      
      // Tìm và xóa issue
      if (!issues[project]) {
        return res.json({ error: 'could not delete', '_id': _id });
      }
      
      const issueIndex = issues[project].findIndex(issue => issue._id === _id);
      
      if (issueIndex === -1) {
        return res.json({ error: 'could not delete', '_id': _id });
      }
      
      issues[project].splice(issueIndex, 1);
      
      res.json({ result: 'successfully deleted', '_id': _id });
    });
    
};

// Hàm tạo ID ngẫu nhiên
function generateId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}
