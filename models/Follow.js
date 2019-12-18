const usersCollection = require('../db').db().collection('users')
const followsCollection = require('../db').db().collection('follows')
const ObjectId = require('mongodb').ObjectID

let Follow = function (followedUsername, authorId) {
  this.followedUsername = followedUsername
  this.authorId = authorId
  this.errors = []
}

Follow.prototype.create = function() {
  return new Promise(async (resolve, reject) => {
    this.cleanUp()
    await this.validate()
    if (!this.errors.length) {
       await followsCollection.insertOne({followedId: this.followedId, authorId: new ObjectId(this.authorId)})
       resolve()
    } else {
      reject(this.errors)
    }
  })
}

Follow.prototype.cleanUp = function() {
  if (typeof(this.followedUsername) != 'string') {this.followedUsername = ''}
}

Follow.prototype.validate = async function() {
  let followedAccount = await usersCollection.findOne({username: this.followedUsername})
  if (followedAccount) {
    this.followedId = followedAccount._id
  } else {
    this.errors.push('You cannot follow a user taht does not exist.')
  }
}

Follow.isVisitorFollowing = async function (followedId, visitorId) {
  let followDoc = await followsCollection.findOne({followedId: followedId, authorId: new ObjectId(visitorId)})
  if (followDoc) {
    return true
  } else {
    return false
  }
}

module.exports = Follow