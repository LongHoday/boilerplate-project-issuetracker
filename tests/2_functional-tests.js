const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
  let testId1; // Lưu ID để sử dụng trong các test sau
  let testId2;
  
  suite('POST requests to /api/issues/{project}', function() {
    
    test('Create an issue with every field', function(done) {
      chai.request(server)
        .post('/api/issues/test-project')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');
          assert.property(res.body, '_id');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.property(res.body, 'open');
          assert.equal(res.body.open, true);
          testId1 = res.body._id; // Lưu ID để dùng cho các test sau
          done();
        });
    });
    
    test('Create an issue with only required fields', function(done) {
      chai.request(server)
        .post('/api/issues/test-project')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Required fields only'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Required fields only');
          assert.equal(res.body.assigned_to, '');
          assert.equal(res.body.status_text, '');
          assert.property(res.body, '_id');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.property(res.body, 'open');
          assert.equal(res.body.open, true);
          testId2 = res.body._id; // Lưu ID để dùng cho các test sau
          done();
        });
    });
    
    test('Create an issue with missing required fields', function(done) {
      chai.request(server)
        .post('/api/issues/test-project')
        .send({
          issue_title: 'Title'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'required field(s) missing');
          done();
        });
    });
    
  });
  
  suite('GET requests to /api/issues/{project}', function() {
    
    test('View issues on a project', function(done) {
      chai.request(server)
        .get('/api/issues/test-project')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isAtLeast(res.body.length, 2);
          assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'open');
          done();
        });
    });
    
    test('View issues on a project with one filter', function(done) {
      chai.request(server)
        .get('/api/issues/test-project')
        .query({ created_by: 'Functional Test - Every field filled in' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isAtLeast(res.body.length, 1);
          res.body.forEach(issue => {
            assert.equal(issue.created_by, 'Functional Test - Every field filled in');
          });
          done();
        });
    });
    
    test('View issues on a project with multiple filters', function(done) {
      chai.request(server)
        .get('/api/issues/test-project')
        .query({ 
          created_by: 'Functional Test - Every field filled in',
          open: true
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          res.body.forEach(issue => {
            assert.equal(issue.created_by, 'Functional Test - Every field filled in');
            assert.equal(issue.open, true);
          });
          done();
        });
    });
    
  });
  
  suite('PUT requests to /api/issues/{project}', function() {
    
    test('Update one field on an issue', function(done) {
      chai.request(server)
        .put('/api/issues/test-project')
        .send({
          _id: testId1,
          issue_text: 'updated text'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully updated');
          assert.equal(res.body._id, testId1);
          done();
        });
    });
    
    test('Update multiple fields on an issue', function(done) {
      chai.request(server)
        .put('/api/issues/test-project')
        .send({
          _id: testId1,
          issue_title: 'Updated Title',
          issue_text: 'Updated text',
          assigned_to: 'Updated assignee'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully updated');
          assert.equal(res.body._id, testId1);
          done();
        });
    });
    
    test('Update an issue with missing _id', function(done) {
      chai.request(server)
        .put('/api/issues/test-project')
        .send({
          issue_text: 'updated text'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });
    
    test('Update an issue with no fields to update', function(done) {
      chai.request(server)
        .put('/api/issues/test-project')
        .send({
          _id: testId1
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'no update field(s) sent');
          assert.equal(res.body._id, testId1);
          done();
        });
    });
    
    test('Update an issue with an invalid _id', function(done) {
      chai.request(server)
        .put('/api/issues/test-project')
        .send({
          _id: 'invalid_id_12345',
          issue_text: 'updated text'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'could not update');
          assert.equal(res.body._id, 'invalid_id_12345');
          done();
        });
    });
    
  });
  
  suite('DELETE requests to /api/issues/{project}', function() {
    
    test('Delete an issue', function(done) {
      chai.request(server)
        .delete('/api/issues/test-project')
        .send({
          _id: testId2
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully deleted');
          assert.equal(res.body._id, testId2);
          done();
        });
    });
    
    test('Delete an issue with an invalid _id', function(done) {
      chai.request(server)
        .delete('/api/issues/test-project')
        .send({
          _id: 'invalid_id_12345'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'could not delete');
          assert.equal(res.body._id, 'invalid_id_12345');
          done();
        });
    });
    
    test('Delete an issue with missing _id', function(done) {
      chai.request(server)
        .delete('/api/issues/test-project')
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });
    
  });
  
});
