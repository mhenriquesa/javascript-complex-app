let Post = require('../models/Posts')

exports.viewCreateScreen = function(req, res) {
    if (req.session.user) {
      res.render('create-post'/*, {username: req.session.user.username, avatar: req.session.user.avatar}*/)
    } else {
      res.render('home-guest')
    }
  }

  exports.create = function (req, res) {
    let post = new Post(req.body, req.session.user._id)
    post.create()
    .then(newId => {
      req.flash('success', 'Post criado com sucesso')
      req.session.save(() => res.redirect(`/post/${newId}`))
    })
    .catch(errors => {
      errors.forEach(error => req.flash('errors', error))
      req.session.save(() => res.redirect('/create-post'))
    })
  }

  exports.viewSingle = async function (req, res) {
    // findSingleById vai retornar uma promise, usar try catch permite definir o que acontece nos 2 cenarios
    try {
      let post = await Post.findSingleById(req.params.id, req.visitorId )
      res.render('single-post-screen', {post: post})
    } catch {
      res.render('404')
    }
  }

  exports.viewEditScreen = async function (req,res) {
    try {
      let post = await Post.findSingleById(req.params.id)
      console.log(post, req.params)
      if (post.authorId == req.visitorId) {
        res.render('edit-post', {post: post})        
      } else {
        req.flash('errors', 'Você não tem permissão para a ação')
        req.session.save(() => res.redirect('/'))
      }

    } catch {
      res.render('404')
    }
  }

  exports.edit = function (req, res) {
    let post = new Post(req.body, req.visitorId, req.params.id)
    post.update().then( status => {
      if (status == 'success') {
        req.flash('success', 'Post atualizado')
        req.session.save( () => res.redirect(`/post/${req.params.id}`) ) 
      } else {
        post.errors.forEach( error => req.flash('errors', error))
        req.session.save( () => res.redirect(`/post/${req.params.id}/edit`) )
      }
    }).catch( () => {
      req.flash('errors', 'Você não tem permissão para a ação')
      req.session.save( () => res.redirect('/') )
    })
  }
