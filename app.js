(function() {
  return {
    events: {
      'app.activated': 'activated',
      'ticket.save'  : 'trySave',
      'click .reject': 'safeDone',
      'click .accept': 'setAssigneeAndSafeDone'
    },

    activated: function(){
      this.switchTo('modal', { modal_message: this.I18n.t('modal.main',
                                                          { name: this.currentUser().name() })});
    },

    trySave: function(){
      if (this.canSave()) { return true; }

      this.modalField().modal('show');

      return this.promise(function(done, fail) {
        var self = this;
        this.done = done;

        this.timeoutId = setTimeout(function() {
          self.safeDone();
        }, 15000);
      });
    },

    canSave: function(){
      return this.ticket().assignee().user() ||
        this.ticket().status() !== 'solved';
    },

    setAssigneeAndSafeDone: function(){
      this.ticket().assignee({
        userId: this.currentUser().id()
      });

      this.safeDone();
    },

    safeDone: function(){
      if (this.timeoutId) { clearTimeout(this.timeoutId); }

      this.modalField().modal('hide');

      return this.done && this.done();
    },

    modalField: function(){
      return this.$('.assign-on-solve-modal');
    }
  };

}());
