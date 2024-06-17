// active-view-plugin.js

class ActiveViewPlugin {
  constructor(eventBus) {
    // Listen for the custom event 'my.custom.event'
    eventBus.on('my.custom.event', (event) => {
      console.log('Custom event received:', event);
      // You can access the additional data passed with the event
      console.log('Event data:', event.foo);
    });
  }
}

// Dependency injection to access eventBus
ActiveViewPlugin.$inject = ['eventBus'];

module.exports = {
  __init__: ['activeViewPlugin'],
  activeViewPlugin: ['type', ActiveViewPlugin]
};
