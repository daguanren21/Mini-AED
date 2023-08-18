const Taro = require("@tarojs/taro");
const esptouch = require('./esptouch-v2.js')
if (typeof esptouch === 'undefined') {
  throw new Error("Error loading module 'provisioner'. Load 'esptouch-v2' first please.");
}

const DEVICE_PORT = 7001;
const APP_PORTS = [18266, 28266, 38266, 48266];
const DEVICE_ADDRESS = '255.255.255.255';

const SYNC_INTERVAL = 100;
const PROVISION_INTERVAL = 15;
const PROVISION_INTERVAL2 = 100;
const PROVISION_TIMEOUT = 90000;

function int4toHex(i) {
  switch (i) {
    case 0: return '0';
    case 1: return '1';
    case 2: return '2';
    case 3: return '3';
    case 4: return '4';
    case 5: return '5';
    case 6: return '6';
    case 7: return '7';
    case 8: return '8';
    case 9: return '9';
    case 10: return 'a';
    case 11: return 'b';
    case 12: return 'c';
    case 13: return 'd';
    case 14: return 'e';
    case 15: return 'f';
  }
}

function intToHex(i) {
  return int4toHex(i >> 4 & 0xf) + int4toHex(i & 0xf);
}

function closeProvisioner(provisioner) {
  provisioner.stopSync();
  provisioner.stopProvisioning();
}

function startSyncProvisioner(provisioner, callback) {
  const syncSo = provisioner.syncSocket;
  if (syncSo != null) {
    if (callback != null && callback.onError != null) {
      callback.onError({
        message: "Sync task has started"
      });
    }
    return;
  }
  const provisionCo = provisioner.provisionSocket;
  if (provisionCo != null) {
    if (callback != null && callback.onError != null) {
      callback.onError({
        message: "Provision task is running"
      });
    }
    return;
  }

  const newSocket = Taro.createUDPSocket();
  // newSocket.onError(function(res){
  //   console.log("Sync UDP Socket error: " + res.errMsg);
  // });
  newSocket.bind();
  if (newSocket == null) {
    if (callback != null && callback.onError != null) {
      callback.onError({
        message: "Create Sync UDP socket failed"
      });
    }
    return;
  }

  provisioner.syncSocket = newSocket;
  provisioner.syncCB = callback;
  provisioner.syncPacket = esptouch.getSyncPacket()
  provisioner.syncTaskId = setInterval(function () {
    const socket = provisioner.syncSocket;
    if (socket == null) {
      console.log("Sync Over");
      const taskId = provisioner.syncTaskId;
      if (taskId != null) {
        clearInterval(taskId);
        provisioner.syncTaskId = null;
      }
      return;
    }
    const packet = provisioner.syncPacket;
    const obj = {
      address: DEVICE_ADDRESS,
      port: DEVICE_PORT,
      message: packet
    }
    socket.send(obj);
  }, SYNC_INTERVAL)
  if (callback != null && callback.onStart != null) {
    callback.onStart();
  }
}

function stopSyncProvisioner(provisioner) {
  const taskId = provisioner.syncTaskId;
  if (taskId != null) {
    clearInterval(taskId);
    provisioner.syncTaskId = null;
  }
  const socket = provisioner.syncSocket;
  if (socket == null) {
    return;
  }

  socket.close();
  const callback = provisioner.syncCB;
  if (callback != null && callback.onStop != null) {
    callback.onStop();
  }
  provisioner.syncCB = null;
  provisioner.syncSocket = null;
  provisioner.syncPacket = null;
}

function startProvisioningProvisioner(provisioner, request, callback) {
  const syncSo = provisioner.syncSocket;
  if (syncSo != null) {
    if (callback != null && callback.onError != null) {
      callback.onError({
        message: "Sync task is running"
      });
    }
    return;
  }
  const provisionSo = provisioner.provisionSocket;
  if (provisionSo != null) {
    if (callback != null && callback.onError != null) {
      callback.onError({
        message: "Provision task has started"
      });
    }
    return;
  }

  var newSocket = null;
  var bound = false;
  var appPort = 0;
  var portMark = -1;
  newSocket = Taro.createUDPSocket();
  for (let i = 0; i < APP_PORTS.length; ++i) {
    const port = APP_PORTS[i];
    const boundPort = newSocket.bind(port);
    console.log('boundPort111', boundPort)
    console.log('port111', port)
    if (boundPort == port) {
      bound = true;
      appPort = port;
      portMark = i;
      break;
    }
  }
  if (!bound) {
    newSocket.close();
    if (callback != null && callback.onError != null) {
      callback.onError({
        message: "Bind port failed"
      });
    }
    return;
  }

  newSocket.onError(function (res) {
    const msg = "errCode: " + res.errCode + ", " + res.errMsg;
    console.log(msg);
    if (callback != null && callback.onError != null) {
      callback.onError({
        message: msg
      });
    }
    provisioner.stopProvisioning();
  });

  var address = request.address;
  if (address == null) {
    address = new Int8Array(4);
    for (let i = 0; i < address.length; ++i) {
      address[i] = -1;
    }
  }
  const packets = esptouch.getProvisionPackets(address, request.ssid, request.bssid, request.password, request.custom, request.aesKey, appPort, portMark).toArray();
  const results = [];
  provisioner.results = results;
  newSocket.onMessage(function (res) {
    const remoteInfo = res.remoteInfo;
    const address = remoteInfo.address;
    const size = remoteInfo.size;
    console.log("remoteInfo.size",size)
    if (size < 7) {
      console.log("Invalid EspTouch response");
      return;
    }
    console.log("响应结果onResult",res.message)
    console.log("响应结果onResul1t1",callback.onResult)
    if (callback != null && callback.onResult != null) {
      const data = new Uint8Array(res.message);
      var bssid = "";
      for (let i = 1; i < 7; ++i) {
        var b = data[i] & 0xff;
        var v = intToHex(b);
        bssid += v;
        if (i < 6) {
          bssid += ":";
        }
      }
      if (results.indexOf(bssid) == -1) {
        results.push(bssid);
        const result = {
          bssid: bssid,
          address: address
        }
        console.log(result);
        callback.onResult(result);
      }
    }
  }); // end socket onMessage
  newSocket.onListening(function () { });
  provisioner.provisionSocket = newSocket;
  provisioner.provisionCB = callback;
  provisioner.provisionPackets = packets;
  const currTime = new Date().getTime();
  const endTime = currTime + PROVISION_TIMEOUT;
  const halfTime = currTime + PROVISION_TIMEOUT / 2;
  const res = {
    interval: 300,
    offset: 0,
    endTime: endTime,
    halfTime: halfTime
  }
  const task = function () {
    const socket = provisioner.provisionSocket;
    if (socket == null) {
      console.log("Provision Over");
      const taskId = provisioner.provisionTaskId;
      if (taskId != null) {
        clearTimeout(taskId);
        sprovisionerelf.taskId = null;
      }
      return;
    }
    const endTime = res.endTime;
    const halfTime = res.halfTime;
    const currTime = new Date().getTime();
    if (currTime > endTime) {
      provisioner.stopProvisioning();
      return;
    } else if (currTime > halfTime) {
      res.interval = PROVISION_INTERVAL2;
    } else {
      res.interval = PROVISION_INTERVAL;
    }
    const packets = provisioner.provisionPackets;
    var offset = res.offset;
    if (offset >= packets.length) {
      offset = 0;
    }
    const packet = packets[offset];
    socket.send({
      address: DEVICE_ADDRESS,
      port: DEVICE_PORT,
      message: packet
    });
    res.offset = offset + 1;

    provisioner.provisionTaskId = setTimeout(task, res.interval);
  }

  provisioner.provisionTaskId = setTimeout(task, 300);
  if (callback != null && callback.onStart != null) {
    callback.onStart();
  }
}

function stopProvisioningProvisioner(provisioner) {
  const taskId = provisioner.provisionTaskId;
  if (taskId != null) {
    clearTimeout(taskId);
    provisioner.taskId = null;
  }
  const socket = provisioner.provisionSocket;
  if (socket == null) {
    return;
  }

  socket.close();
  const callback = provisioner.provisionCB;
  if (callback != null && callback.onStop != null) {
    callback.onStop();
  }
  provisioner.provisionCB = null;
  provisioner.provisionSocket = null;
  provisioner.provisionPackets = null;
}

function createProvisioner() {
  const provisioner = {
    syncSocket: null,
    provisionSocket: null,

    syncCB: null,
    provisionCB: null,

    syncPacket: null,
    provisionPackets: null,

    syncTaskId: null,
    provisionTaskId: null,

    results: [],

    close: function () {
      closeProvisioner(this);
    },

    startSync: function (callback) {
      startSyncProvisioner(this, callback);
    },

    stopSync: function () {
      stopSyncProvisioner(this);
    },

    startProvisioning: function (request, callback) {
      startProvisioningProvisioner(this, request, callback);
    },

    stopProvisioning: function () {
      stopProvisioningProvisioner(this);
    }
  }; // end provisiner create

  return provisioner;
};

module.exports = {
  createProvisioner: createProvisioner,
}