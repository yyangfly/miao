var express = require('express');
var router = express.Router();
var store = require('../lib/store');

function getCurrentUser(req) {
  var token = req.cookies.bbs_session;
  if (!token) {
    return null;
  }
  return store.getUserBySession(token);
}

function requireAuth(req, res, next) {
  var user = getCurrentUser(req);
  if (!user) {
    return res.redirect('/login?error=请先登录');
  }
  req.currentUser = user;
  next();
}

function normalizeText(value) {
  return String(value || '').trim();
}

router.get('/', function(req, res) {
  var currentUser = getCurrentUser(req);
  res.render('index', {
    title: 'BBS',
    currentUser: currentUser,
    posts: store.listPostsWithAuthors(),
    error: req.query.error,
    success: req.query.success
  });
});

router.get('/register', function(req, res) {
  res.render('register', {
    title: '注册',
    currentUser: getCurrentUser(req),
    error: req.query.error
  });
});

router.post('/register', function(req, res) {
  var username = normalizeText(req.body.username);
  var password = normalizeText(req.body.password);

  if (!username || !password) {
    return res.redirect('/register?error=用户名和密码不能为空');
  }

  var result = store.createUser(username, password);
  if (result.error) {
    return res.redirect('/register?error=' + encodeURIComponent(result.error));
  }

  var token = store.createSession(result.user.id);
  res.cookie('bbs_session', token, { httpOnly: true });
  res.redirect('/?success=注册成功');
});

router.get('/login', function(req, res) {
  res.render('login', {
    title: '登录',
    currentUser: getCurrentUser(req),
    error: req.query.error
  });
});

router.post('/login', function(req, res) {
  var username = normalizeText(req.body.username);
  var password = normalizeText(req.body.password);
  var user = store.authenticateUser(username, password);

  if (!user) {
    return res.redirect('/login?error=用户名或密码错误');
  }

  var token = store.createSession(user.id);
  res.cookie('bbs_session', token, { 
    // httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000  
  });
  res.redirect('/?success=登录成功');
});

router.post('/logout', function(req, res) {
  var token = req.cookies.bbs_session;
  if (token) {
    store.removeSession(token);
  }
  res.clearCookie('bbs_session');
  res.redirect('/?success=已退出');
});

router.post('/posts', requireAuth, function(req, res) {
  var title = normalizeText(req.body.title);
  var content = normalizeText(req.body.content);

  if (!title || !content) {
    return res.redirect('/?error=标题和内容不能为空');
  }

  var post = store.createPost(req.currentUser.id, title, content);
  res.redirect('/posts/' + post.id);
});

router.get('/posts/:id', function(req, res, next) {
  var postId = Number(req.params.id);
  if (Number.isNaN(postId)) {
    return next();
  }

  var post = store.getPostWithDetails(postId);
  if (!post) {
    return next();
  }

  res.render('post', {
    title: post.title,
    currentUser: getCurrentUser(req),
    post: post,
    error: req.query.error
  });
});

router.post('/posts/:id/comments', requireAuth, function(req, res, next) {
  var postId = Number(req.params.id);
  if (Number.isNaN(postId)) {
    return next();
  }

  var post = store.getPostWithDetails(postId);
  if (!post) {
    return next();
  }

  var content = normalizeText(req.body.content);
  if (!content) {
    return res.redirect('/posts/' + postId + '?error=评论内容不能为空');
  }

  store.addComment(postId, req.currentUser.id, content);
  res.redirect('/posts/' + postId);
});

module.exports = router;
