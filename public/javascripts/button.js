function Button() {};

Button.hasDeterminedIfTouchDevice = false;
Button.isTouchDevice = false;

Button.down = function(self, event) {
  event.stopPropagation();

  self.savedClassName = self.className;
  self.className += ' pressed';
  self.isTouchDown = true;
};

Button.move = function(self, event) {
  event.stopPropagation();

  if (self.isTouchDown) {
    self.className = self.savedClassName;
    self.isTouchDown = false;
  }
};

Button.up = function(self, event) {
  if (self.isTouchDown) {
    event.stopPropagation();

    self.className = self.savedClassName;
    self.isTouchDown = false;
    self.clickFunction(self);
  }
};

Button.setupDeviceType = function(isTouchDevice) {
  if (!Button.hasDeterminedIfTouchDevice) {
    Button.hasDeterminedIfTouchDevice = true;
    Button.isTouchDevice = isTouchDevice;
  }
};

Button.touchstart = function(event) {
  Button.setupDeviceType(true);
  if (Button.isTouchDevice) {
    Button.down(this, event);
  }
};

Button.touchmove = function(event) {
  Button.setupDeviceType(true);
  if (Button.isTouchDevice) {
    Button.move(this, event);
  }
};

Button.touchend = function(event) {
  Button.setupDeviceType(true);
  if (Button.isTouchDevice) {
    Button.up(this, event);
  }
};

Button.mousedown = function(event) {
  Button.setupDeviceType(false);
  if (!Button.isTouchDevice) {
    Button.down(this, event);
  }
};

Button.mousemove = function(event) {
  Button.setupDeviceType(false);
  if (!Button.isTouchDevice) {
    Button.move(this, event);
  }
};

Button.mouseup = function(event) {
  Button.setupDeviceType(false);
  if (!Button.isTouchDevice) {
    Button.up(this, event);
  }
};

Button.enable = function(button, callback) {
  if (!Button.hasDeterminedIfTouchDevice || Button.isTouchDevice) {
    button.addEventListener('touchstart', Button.touchstart);
    button.addEventListener('touchmove', Button.touchmove);
    button.addEventListener('touchend', Button.touchend);
  }
  if (!Button.hasDeterminedIfTouchDevice || !Button.isTouchDevice) {
    button.addEventListener('mousedown', Button.mousedown);
    button.addEventListener('mousemove', Button.mousemove);
    button.addEventListener('mouseup', Button.mouseup);
  }
  button.clickFunction = function(element) {
    callback(element);
  };
};

Button.disable = function(button) {
  button.removeEventListener('touchstart', Button.touchstart);
  button.removeEventListener('touchmove', Button.touchmove);
  button.removeEventListener('touchend', Button.touchend);
  button.removeEventListener('mousedown', Button.mousedown);
  button.removeEventListener('mousemove', Button.mousemove);
  button.removeEventListener('mouseup', Button.mouseup);
};
