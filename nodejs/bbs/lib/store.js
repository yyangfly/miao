var crypto = require('crypto');

var users = [];
var posts = [];
var comments = [];
var sessions = new Map();

var nextUserId = 1;
var nextPostId = 1;
var nextCommentId = 1;

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function createUser(username, password) {
  var existing = users.find(function(user) {
    return user.username === username;
  });

  if (existing) {
    return { error: '用户名已存在' };
  }

  var user = {
    id: nextUserId++,
    username: username,
    passwordHash: hashPassword(password)
  };

  users.push(user);
  return { user: user };
}

function authenticateUser(username, password) {
  var passwordHash = hashPassword(password);
  return users.find(function(user) {
    return user.username === username && user.passwordHash === passwordHash;
  }) || null;
}

function createSession(userId) {
  var token = crypto.randomUUID();
  sessions.set(token, userId);
  return token;
}

function getUserBySession(token) {
  var userId = sessions.get(token);
  if (!userId) {
    return null;
  }
  return users.find(function(user) {
    return user.id === userId;
  }) || null;
}

function removeSession(token) {
  sessions.delete(token);
}

function createPost(userId, title, content) {
  var post = {
    id: nextPostId++,
    userId: userId,
    title: title,
    content: content,
    createdAt: new Date()
  };
  posts.unshift(post);
  return post;
}

function listPostsWithAuthors() {
  return posts.map(function(post) {
    var author = users.find(function(user) {
      return user.id === post.userId;
    });
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      authorName: author ? author.username : 'Unknown'
    };
  });
}

function getPostWithDetails(postId) {
  var post = posts.find(function(item) {
    return item.id === postId;
  });
  if (!post) {
    return null;
  }

  var author = users.find(function(user) {
    return user.id === post.userId;
  });

  var postComments = comments
    .filter(function(comment) {
      return comment.postId === postId;
    })
    .map(function(comment) {
      var commenter = users.find(function(user) {
        return user.id === comment.userId;
      });
      return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        authorName: commenter ? commenter.username : 'Unknown'
      };
    });

  return {
    id: post.id,
    title: post.title,
    content: post.content,
    createdAt: post.createdAt,
    authorName: author ? author.username : 'Unknown',
    comments: postComments
  };
}

function addComment(postId, userId, content) {
  var comment = {
    id: nextCommentId++,
    postId: postId,
    userId: userId,
    content: content,
    createdAt: new Date()
  };
  comments.push(comment);
  return comment;
}

module.exports = {
  createUser: createUser,
  authenticateUser: authenticateUser,
  createSession: createSession,
  getUserBySession: getUserBySession,
  removeSession: removeSession,
  createPost: createPost,
  listPostsWithAuthors: listPostsWithAuthors,
  getPostWithDetails: getPostWithDetails,
  addComment: addComment
};
