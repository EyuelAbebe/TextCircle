Meteor.methods({
  addEditingUser: function(docid){

    var doc, users, eusers;
    doc = Documents.findOne({_id: docid});

    if(!doc){return;} // no doc
    if(!this.userId){return;} // no doc

    // now we have a user and document
    user = Meteor.user().profile;
    eusers = EditingUsers.findOne({docid: doc._id});
    if(!eusers){
      eusers = {
        docid: doc._id,
        users: {}
      }
    }
    
    user.lastEdit = new Date();
    eusers.users[this.userId] = user;
    EditingUsers.upsert({_id:eusers._id}, eusers);
  },

  addDoc: function(){
    if(!this.userId){return;} // no user, do nothing
    else{
      var doc;
      doc = {owner:this.userId, created: new Date(), title: "my new doc"};
      var id = Documents.insert(doc);

      console.log("addDoc method got an id: ", id);
      return id;
    }
  },

  updateDocPrivacy: function(doc){
    console.log("Update privacy method");
    console.log(doc);
    var realDoc = Documents.findOne({_id: doc._id, owner: this.userId});
    if(realDoc){
      realDoc.isPrivate = doc.isPrivate;
      Documents.update({_id:doc._id}, realDoc);
    }
  },

  addComment: function(comment){
      console.log("Add comment");
      if (this.userId){// we have a user
        //comment.createdOn = new Date();
        //comment.owner = this.userId;
        return Comments.insert(comment);
      }
      return;
    }
});