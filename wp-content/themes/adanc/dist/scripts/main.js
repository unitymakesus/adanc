/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "dd6a59658ce888c1a2d2"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:3000/wp-content/themes/adanc/dist/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(17)(__webpack_require__.s = 17);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!***************************************************************************************************************************************!*\
  !*** /Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/node_modules/html-entities/lib/html5-entities.js ***!
  \***************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['CloseCurlyDoubleQuote', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['CloseCurlyQuote', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];

var alphaIndex = {};
var charIndex = {};

createIndexes(alphaIndex, charIndex);

/**
 * @constructor
 */
function Html5Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1) === 'x' ?
                parseInt(entity.substr(2).toLowerCase(), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.decode = function(str) {
    return new Html5Entities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var charInfo = charIndex[str.charCodeAt(i)];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        result += str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encode = function(str) {
    return new Html5Entities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var charInfo = charIndex[c];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonUTF = function(str) {
    return new Html5Entities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonASCII = function(str) {
    return new Html5Entities().encodeNonASCII(str);
 };

/**
 * @param {Object} alphaIndex Passed by reference.
 * @param {Object} charIndex Passed by reference.
 */
function createIndexes(alphaIndex, charIndex) {
    var i = ENTITIES.length;
    var _results = [];
    while (i--) {
        var e = ENTITIES[i];
        var alpha = e[0];
        var chars = e[1];
        var chr = chars[0];
        var addChar = (chr < 32 || chr > 126) || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
        var charInfo;
        if (addChar) {
            charInfo = charIndex[chr] = charIndex[chr] || {};
        }
        if (chars[1]) {
            var chr2 = chars[1];
            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
            _results.push(addChar && (charInfo[chr2] = alpha));
        } else {
            alphaIndex[alpha] = String.fromCharCode(chr);
            _results.push(addChar && (charInfo[''] = alpha));
        }
    }
}

module.exports = Html5Entities;


/***/ }),
/* 1 */
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 2 */
/*!*************************************!*\
  !*** ./build/helpers/hmr-client.js ***!
  \*************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var hotMiddlewareScript = __webpack_require__(/*! webpack-hot-middleware/client?noInfo=true&timeout=20000&reload=true */ 3);

hotMiddlewareScript.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload();
  }
});


/***/ }),
/* 3 */
/*!********************************************************************************!*\
  !*** (webpack)-hot-middleware/client.js?noInfo=true&timeout=20000&reload=true ***!
  \********************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery, module) {/*eslint-env browser*/
/*global __resourceQuery __webpack_public_path__*/

var options = {
  path: "/__webpack_hmr",
  timeout: 20 * 1000,
  overlay: true,
  reload: false,
  log: true,
  warn: true,
  name: '',
  autoConnect: true,
  overlayStyles: {},
  overlayWarnings: false,
  ansiColors: {}
};
if (true) {
  var querystring = __webpack_require__(/*! querystring */ 5);
  var overrides = querystring.parse(__resourceQuery.slice(1));
  setOverrides(overrides);
}

if (typeof window === 'undefined') {
  // do nothing
} else if (typeof window.EventSource === 'undefined') {
  console.warn(
    "webpack-hot-middleware's client requires EventSource to work. " +
    "You should include a polyfill if you want to support this browser: " +
    "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools"
  );
} else {
  if (options.autoConnect) {
    connect();
  }
}

/* istanbul ignore next */
function setOptionsAndConnect(overrides) {
  setOverrides(overrides);
  connect();
}

function setOverrides(overrides) {
  if (overrides.autoConnect) options.autoConnect = overrides.autoConnect == 'true';
  if (overrides.path) options.path = overrides.path;
  if (overrides.timeout) options.timeout = overrides.timeout;
  if (overrides.overlay) options.overlay = overrides.overlay !== 'false';
  if (overrides.reload) options.reload = overrides.reload !== 'false';
  if (overrides.noInfo && overrides.noInfo !== 'false') {
    options.log = false;
  }
  if (overrides.name) {
    options.name = overrides.name;
  }
  if (overrides.quiet && overrides.quiet !== 'false') {
    options.log = false;
    options.warn = false;
  }

  if (overrides.dynamicPublicPath) {
    options.path = __webpack_require__.p + options.path;
  }

  if (overrides.ansiColors) options.ansiColors = JSON.parse(overrides.ansiColors);
  if (overrides.overlayStyles) options.overlayStyles = JSON.parse(overrides.overlayStyles);

  if (overrides.overlayWarnings) {
    options.overlayWarnings = overrides.overlayWarnings == 'true';
  }
}

function EventSourceWrapper() {
  var source;
  var lastActivity = new Date();
  var listeners = [];

  init();
  var timer = setInterval(function() {
    if ((new Date() - lastActivity) > options.timeout) {
      handleDisconnect();
    }
  }, options.timeout / 2);

  function init() {
    source = new window.EventSource(options.path);
    source.onopen = handleOnline;
    source.onerror = handleDisconnect;
    source.onmessage = handleMessage;
  }

  function handleOnline() {
    if (options.log) console.log("[HMR] connected");
    lastActivity = new Date();
  }

  function handleMessage(event) {
    lastActivity = new Date();
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](event);
    }
  }

  function handleDisconnect() {
    clearInterval(timer);
    source.close();
    setTimeout(init, options.timeout);
  }

  return {
    addMessageListener: function(fn) {
      listeners.push(fn);
    }
  };
}

function getEventSourceWrapper() {
  if (!window.__whmEventSourceWrapper) {
    window.__whmEventSourceWrapper = {};
  }
  if (!window.__whmEventSourceWrapper[options.path]) {
    // cache the wrapper for other entries loaded on
    // the same page with the same options.path
    window.__whmEventSourceWrapper[options.path] = EventSourceWrapper();
  }
  return window.__whmEventSourceWrapper[options.path];
}

function connect() {
  getEventSourceWrapper().addMessageListener(handleMessage);

  function handleMessage(event) {
    if (event.data == "\uD83D\uDC93") {
      return;
    }
    try {
      processMessage(JSON.parse(event.data));
    } catch (ex) {
      if (options.warn) {
        console.warn("Invalid HMR message: " + event.data + "\n" + ex);
      }
    }
  }
}

// the reporter needs to be a singleton on the page
// in case the client is being used by multiple bundles
// we only want to report once.
// all the errors will go to all clients
var singletonKey = '__webpack_hot_middleware_reporter__';
var reporter;
if (typeof window !== 'undefined') {
  if (!window[singletonKey]) {
    window[singletonKey] = createReporter();
  }
  reporter = window[singletonKey];
}

function createReporter() {
  var strip = __webpack_require__(/*! strip-ansi */ 8);

  var overlay;
  if (typeof document !== 'undefined' && options.overlay) {
    overlay = __webpack_require__(/*! ./client-overlay */ 10)({
      ansiColors: options.ansiColors,
      overlayStyles: options.overlayStyles
    });
  }

  var styles = {
    errors: "color: #ff0000;",
    warnings: "color: #999933;"
  };
  var previousProblems = null;
  function log(type, obj) {
    var newProblems = obj[type].map(function(msg) { return strip(msg); }).join('\n');
    if (previousProblems == newProblems) {
      return;
    } else {
      previousProblems = newProblems;
    }

    var style = styles[type];
    var name = obj.name ? "'" + obj.name + "' " : "";
    var title = "[HMR] bundle " + name + "has " + obj[type].length + " " + type;
    // NOTE: console.warn or console.error will print the stack trace
    // which isn't helpful here, so using console.log to escape it.
    if (console.group && console.groupEnd) {
      console.group("%c" + title, style);
      console.log("%c" + newProblems, style);
      console.groupEnd();
    } else {
      console.log(
        "%c" + title + "\n\t%c" + newProblems.replace(/\n/g, "\n\t"),
        style + "font-weight: bold;",
        style + "font-weight: normal;"
      );
    }
  }

  return {
    cleanProblemsCache: function () {
      previousProblems = null;
    },
    problems: function(type, obj) {
      if (options.warn) {
        log(type, obj);
      }
      if (overlay) {
        if (options.overlayWarnings || type === 'errors') {
          overlay.showProblems(type, obj[type]);
          return false;
        }
        overlay.clear();
      }
      return true;
    },
    success: function() {
      if (overlay) overlay.clear();
    },
    useCustomOverlay: function(customOverlay) {
      overlay = customOverlay;
    }
  };
}

var processUpdate = __webpack_require__(/*! ./process-update */ 15);

var customHandler;
var subscribeAllHandler;
function processMessage(obj) {
  switch(obj.action) {
    case "building":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilding"
        );
      }
      break;
    case "built":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilt in " + obj.time + "ms"
        );
      }
      // fall through
    case "sync":
      if (obj.name && options.name && obj.name !== options.name) {
        return;
      }
      var applyUpdate = true;
      if (obj.errors.length > 0) {
        if (reporter) reporter.problems('errors', obj);
        applyUpdate = false;
      } else if (obj.warnings.length > 0) {
        if (reporter) {
          var overlayShown = reporter.problems('warnings', obj);
          applyUpdate = overlayShown;
        }
      } else {
        if (reporter) {
          reporter.cleanProblemsCache();
          reporter.success();
        }
      }
      if (applyUpdate) {
        processUpdate(obj.hash, obj.modules, options);
      }
      break;
    default:
      if (customHandler) {
        customHandler(obj);
      }
  }

  if (subscribeAllHandler) {
    subscribeAllHandler(obj);
  }
}

if (module) {
  module.exports = {
    subscribeAll: function subscribeAll(handler) {
      subscribeAllHandler = handler;
    },
    subscribe: function subscribe(handler) {
      customHandler = handler;
    },
    useCustomOverlay: function useCustomOverlay(customOverlay) {
      if (reporter) reporter.useCustomOverlay(customOverlay);
    },
    setOptionsAndConnect: setOptionsAndConnect
  };
}

/* WEBPACK VAR INJECTION */}.call(exports, "?noInfo=true&timeout=20000&reload=true", __webpack_require__(/*! ./../webpack/buildin/module.js */ 4)(module)))

/***/ }),
/* 4 */
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 5 */
/*!****************************************************************************************************************************!*\
  !*** /Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/node_modules/querystring-es3/index.js ***!
  \****************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(/*! ./decode */ 6);
exports.encode = exports.stringify = __webpack_require__(/*! ./encode */ 7);


/***/ }),
/* 6 */
/*!*****************************************************************************************************************************!*\
  !*** /Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/node_modules/querystring-es3/decode.js ***!
  \*****************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 7 */
/*!*****************************************************************************************************************************!*\
  !*** /Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/node_modules/querystring-es3/encode.js ***!
  \*****************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 8 */
/*!***********************************************************************************************************************!*\
  !*** /Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/node_modules/strip-ansi/index.js ***!
  \***********************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(/*! ansi-regex */ 9)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),
/* 9 */
/*!***********************************************************************************************************************!*\
  !*** /Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/node_modules/ansi-regex/index.js ***!
  \***********************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};


/***/ }),
/* 10 */
/*!**************************************************!*\
  !*** (webpack)-hot-middleware/client-overlay.js ***!
  \**************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/*eslint-env browser*/

var clientOverlay = document.createElement('div');
clientOverlay.id = 'webpack-hot-middleware-clientOverlay';
var styles = {
  background: 'rgba(0,0,0,0.85)',
  color: '#E8E8E8',
  lineHeight: '1.2',
  whiteSpace: 'pre',
  fontFamily: 'Menlo, Consolas, monospace',
  fontSize: '13px',
  position: 'fixed',
  zIndex: 9999,
  padding: '10px',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflow: 'auto',
  dir: 'ltr',
  textAlign: 'left'
};

var ansiHTML = __webpack_require__(/*! ansi-html */ 11);
var colors = {
  reset: ['transparent', 'transparent'],
  black: '181818',
  red: 'E36049',
  green: 'B3CB74',
  yellow: 'FFD080',
  blue: '7CAFC2',
  magenta: '7FACCA',
  cyan: 'C3C2EF',
  lightgrey: 'EBE7E3',
  darkgrey: '6D7891'
};

var Entities = __webpack_require__(/*! html-entities */ 12).AllHtmlEntities;
var entities = new Entities();

function showProblems(type, lines) {
  clientOverlay.innerHTML = '';
  lines.forEach(function(msg) {
    msg = ansiHTML(entities.encode(msg));
    var div = document.createElement('div');
    div.style.marginBottom = '26px';
    div.innerHTML = problemType(type) + ' in ' + msg;
    clientOverlay.appendChild(div);
  });
  if (document.body) {
    document.body.appendChild(clientOverlay);
  }
}

function clear() {
  if (document.body && clientOverlay.parentNode) {
    document.body.removeChild(clientOverlay);
  }
}

function problemType (type) {
  var problemColors = {
    errors: colors.red,
    warnings: colors.yellow
  };
  var color = problemColors[type] || colors.red;
  return (
    '<span style="background-color:#' + color + '; color:#fff; padding:2px 4px; border-radius: 2px">' +
      type.slice(0, -1).toUpperCase() +
    '</span>'
  );
}

module.exports = function(options) {
  for (var color in options.overlayColors) {
    if (color in colors) {
      colors[color] = options.overlayColors[color];
    }
    ansiHTML.setColors(colors);
  }

  for (var style in options.overlayStyles) {
    styles[style] = options.overlayStyles[style];
  }

  for (var key in styles) {
    clientOverlay.style[key] = styles[key];
  }

  return {
    showProblems: showProblems,
    clear: clear
  }
};

module.exports.clear = clear;
module.exports.showProblems = showProblems;


/***/ }),
/* 11 */
/*!**********************************************************************************************************************!*\
  !*** /Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/node_modules/ansi-html/index.js ***!
  \**********************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = ansiHTML

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
}
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
}
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
}
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>'
})

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML (text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text
  }

  // Cache opened sequence.
  var ansiCodes = []
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
    var ot = _openTags[seq]
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop()
        return '</span>'
      }
      // Open tag.
      ansiCodes.push(seq)
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
    }

    var ct = _closeTags[seq]
    if (ct) {
      // Pop sequence
      ansiCodes.pop()
      return ct
    }
    return ''
  })

  // Make sure tags are closed.
  var l = ansiCodes.length
  ;(l > 0) && (ret += Array(l + 1).join('</span>'))

  return ret
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.')
  }

  var _finalColors = {}
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null
    if (!hex) {
      _finalColors[key] = _defColors[key]
      continue
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex]
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string'
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
      }
      var defHexColor = _defColors[key]
      if (!hex[0]) {
        hex[0] = defHexColor[0]
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]]
        hex.push(defHexColor[1])
      }

      hex = hex.slice(0, 2)
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
    }
    _finalColors[key] = hex
  }
  _setTags(_finalColors)
}

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors)
}

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {}

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () { return _openTags }
  })
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () { return _closeTags }
  })
} else {
  ansiHTML.tags.open = _openTags
  ansiHTML.tags.close = _closeTags
}

function _setTags (colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey

  for (var code in _styles) {
    var color = _styles[code]
    var oriColor = colors[color] || '000'
    _openTags[code] = 'color:#' + oriColor
    code = parseInt(code)
    _openTags[(code + 10).toString()] = 'background:#' + oriColor
  }
}

ansiHTML.reset()


/***/ }),
/* 12 */
/*!**************************************************************************************************************************!*\
  !*** /Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/node_modules/html-entities/index.js ***!
  \**************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  XmlEntities: __webpack_require__(/*! ./lib/xml-entities.js */ 13),
  Html4Entities: __webpack_require__(/*! ./lib/html4-entities.js */ 14),
  Html5Entities: __webpack_require__(/*! ./lib/html5-entities.js */ 0),
  AllHtmlEntities: __webpack_require__(/*! ./lib/html5-entities.js */ 0)
};


/***/ }),
/* 13 */
/*!*************************************************************************************************************************************!*\
  !*** /Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/node_modules/html-entities/lib/xml-entities.js ***!
  \*************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
};

var CHAR_INDEX = {
    60: 'lt',
    62: 'gt',
    34: 'quot',
    39: 'apos',
    38: 'amp'
};

var CHAR_S_INDEX = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;',
    '&': '&amp;'
};

/**
 * @constructor
 */
function XmlEntities() {}

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/<|>|"|'|&/g, function(s) {
        return CHAR_S_INDEX[s];
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encode = function(str) {
    return new XmlEntities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
        if (s.charAt(1) === '#') {
            var code = s.charAt(2).toLowerCase() === 'x' ?
                parseInt(s.substr(3), 16) :
                parseInt(s.substr(2));

            if (isNaN(code) || code < -32768 || code > 65535) {
                return '';
            }
            return String.fromCharCode(code);
        }
        return ALPHA_INDEX[s] || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.decode = function(str) {
    return new XmlEntities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var alpha = CHAR_INDEX[c];
        if (alpha) {
            result += "&" + alpha + ";";
            i++;
            continue;
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonUTF = function(str) {
    return new XmlEntities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLenght = str.length;
    var result = '';
    var i = 0;
    while (i < strLenght) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonASCII = function(str) {
    return new XmlEntities().encodeNonASCII(str);
 };

module.exports = XmlEntities;


/***/ }),
/* 14 */
/*!***************************************************************************************************************************************!*\
  !*** /Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/node_modules/html-entities/lib/html4-entities.js ***!
  \***************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'OElig', 'oelig', 'Scaron', 'scaron', 'Yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'Dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'Prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'lArr', 'uArr', 'rArr', 'dArr', 'hArr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];

var alphaIndex = {};
var numIndex = {};

var i = 0;
var length = HTML_ALPHA.length;
while (i < length) {
    var a = HTML_ALPHA[i];
    var c = HTML_CODES[i];
    alphaIndex[a] = String.fromCharCode(c);
    numIndex[c] = a;
    i++;
}

/**
 * @constructor
 */
function Html4Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1).toLowerCase() === 'x' ?
                parseInt(entity.substr(2), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.decode = function(str) {
    return new Html4Entities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var alpha = numIndex[str.charCodeAt(i)];
        result += alpha ? "&" + alpha + ";" : str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encode = function(str) {
    return new Html4Entities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var cc = str.charCodeAt(i);
        var alpha = numIndex[cc];
        if (alpha) {
            result += "&" + alpha + ";";
        } else if (cc < 32 || cc > 126) {
            result += "&#" + cc + ";";
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonUTF = function(str) {
    return new Html4Entities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonASCII = function(str) {
    return new Html4Entities().encodeNonASCII(str);
};

module.exports = Html4Entities;


/***/ }),
/* 15 */
/*!**************************************************!*\
  !*** (webpack)-hot-middleware/process-update.js ***!
  \**************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Based heavily on https://github.com/webpack/webpack/blob/
 *  c0afdf9c6abc1dd70707c594e473802a566f7b6e/hot/only-dev-server.js
 * Original copyright Tobias Koppers @sokra (MIT license)
 */

/* global window __webpack_hash__ */

if (false) {
  throw new Error("[HMR] Hot Module Replacement is disabled.");
}

var hmrDocsUrl = "https://webpack.js.org/concepts/hot-module-replacement/"; // eslint-disable-line max-len

var lastHash;
var failureStatuses = { abort: 1, fail: 1 };
var applyOptions = { 				
  ignoreUnaccepted: true,
  ignoreDeclined: true,
  ignoreErrored: true,
  onUnaccepted: function(data) {
    console.warn("Ignored an update to unaccepted module " + data.chain.join(" -> "));
  },
  onDeclined: function(data) {
    console.warn("Ignored an update to declined module " + data.chain.join(" -> "));
  },
  onErrored: function(data) {
    console.error(data.error);
    console.warn("Ignored an error while updating module " + data.moduleId + " (" + data.type + ")");
  } 
}

function upToDate(hash) {
  if (hash) lastHash = hash;
  return lastHash == __webpack_require__.h();
}

module.exports = function(hash, moduleMap, options) {
  var reload = options.reload;
  if (!upToDate(hash) && module.hot.status() == "idle") {
    if (options.log) console.log("[HMR] Checking for updates on the server...");
    check();
  }

  function check() {
    var cb = function(err, updatedModules) {
      if (err) return handleError(err);

      if(!updatedModules) {
        if (options.warn) {
          console.warn("[HMR] Cannot find update (Full reload needed)");
          console.warn("[HMR] (Probably because of restarting the server)");
        }
        performReload();
        return null;
      }

      var applyCallback = function(applyErr, renewedModules) {
        if (applyErr) return handleError(applyErr);

        if (!upToDate()) check();

        logUpdates(updatedModules, renewedModules);
      };

      var applyResult = module.hot.apply(applyOptions, applyCallback);
      // webpack 2 promise
      if (applyResult && applyResult.then) {
        // HotModuleReplacement.runtime.js refers to the result as `outdatedModules`
        applyResult.then(function(outdatedModules) {
          applyCallback(null, outdatedModules);
        });
        applyResult.catch(applyCallback);
      }

    };

    var result = module.hot.check(false, cb);
    // webpack 2 promise
    if (result && result.then) {
        result.then(function(updatedModules) {
            cb(null, updatedModules);
        });
        result.catch(cb);
    }
  }

  function logUpdates(updatedModules, renewedModules) {
    var unacceptedModules = updatedModules.filter(function(moduleId) {
      return renewedModules && renewedModules.indexOf(moduleId) < 0;
    });

    if(unacceptedModules.length > 0) {
      if (options.warn) {
        console.warn(
          "[HMR] The following modules couldn't be hot updated: " +
          "(Full reload needed)\n" +
          "This is usually because the modules which have changed " +
          "(and their parents) do not know how to hot reload themselves. " +
          "See " + hmrDocsUrl + " for more details."
        );
        unacceptedModules.forEach(function(moduleId) {
          console.warn("[HMR]  - " + moduleMap[moduleId]);
        });
      }
      performReload();
      return;
    }

    if (options.log) {
      if(!renewedModules || renewedModules.length === 0) {
        console.log("[HMR] Nothing hot updated.");
      } else {
        console.log("[HMR] Updated modules:");
        renewedModules.forEach(function(moduleId) {
          console.log("[HMR]  - " + moduleMap[moduleId]);
        });
      }

      if (upToDate()) {
        console.log("[HMR] App is up to date.");
      }
    }
  }

  function handleError(err) {
    if (module.hot.status() in failureStatuses) {
      if (options.warn) {
        console.warn("[HMR] Cannot check for update (Full reload needed)");
        console.warn("[HMR] " + err.stack || err.message);
      }
      performReload();
      return;
    }
    if (options.warn) {
      console.warn("[HMR] Update check failed: " + err.stack || err.message);
    }
  }

  function performReload() {
    if (reload) {
      if (options.warn) console.warn("[HMR] Reloading page");
      window.location.reload();
    }
  }
};


/***/ }),
/* 16 */
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** /Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/node_modules/cache-loader/dist/cjs.js!/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/node_modules/css-loader?{"sourceMap":true}!/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/node_modules/postcss-loader/lib?{"config":{"path":"/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/build","ctx":{"open":true,"copy":"images/**_/*","proxyUrl":"http://localhost:3000","cacheBusting":"[name]_[hash:8]","paths":{"root":"/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc","assets":"/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets","dist":"/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/dist"},"enabled":{"sourceMaps":true,"optimize":false,"cacheBusting":false,"watcher":true},"watch":["app/**_/*.php","config/**_/*.php","resources/views/**_/*.php"],"entry":{"main":["./scripts/main.js","./styles/main.scss"],"customizer":["./scripts/customizer.js"]},"publicPath":"/wp-content/themes/adanc/dist/","devUrl":"http://adanc.test","env":{"production":false,"development":true},"manifest":{}}},"sourceMap":true}!/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/node_modules/resolve-url-loader?{"sourceMap":true}!/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/node_modules/sass-loader/lib/loader.js?{"sourceMap":true}!/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/node_modules/import-glob!./styles/main.scss ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(/*! ../../../node_modules/css-loader/lib/url/escape.js */ 26);
exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ 27)(true);
// imports


// module
exports.push([module.i, "/** Import everything from autoload */\n\n/**\n * Import npm dependencies\n *\n * Prefix your imports with `~` to grab from node_modules/\n * @see https://github.com/webpack-contrib/sass-loader#imports\n */\n\n.materialize-red {\n  background-color: #e51c23 !important;\n}\n\n.materialize-red-text {\n  color: #e51c23 !important;\n}\n\n.materialize-red.lighten-5 {\n  background-color: #fdeaeb !important;\n}\n\n.materialize-red-text.text-lighten-5 {\n  color: #fdeaeb !important;\n}\n\n.materialize-red.lighten-4 {\n  background-color: #f8c1c3 !important;\n}\n\n.materialize-red-text.text-lighten-4 {\n  color: #f8c1c3 !important;\n}\n\n.materialize-red.lighten-3 {\n  background-color: #f3989b !important;\n}\n\n.materialize-red-text.text-lighten-3 {\n  color: #f3989b !important;\n}\n\n.materialize-red.lighten-2 {\n  background-color: #ee6e73 !important;\n}\n\n.materialize-red-text.text-lighten-2 {\n  color: #ee6e73 !important;\n}\n\n.materialize-red.lighten-1 {\n  background-color: #ea454b !important;\n}\n\n.materialize-red-text.text-lighten-1 {\n  color: #ea454b !important;\n}\n\n.materialize-red.darken-1 {\n  background-color: #d0181e !important;\n}\n\n.materialize-red-text.text-darken-1 {\n  color: #d0181e !important;\n}\n\n.materialize-red.darken-2 {\n  background-color: #b9151b !important;\n}\n\n.materialize-red-text.text-darken-2 {\n  color: #b9151b !important;\n}\n\n.materialize-red.darken-3 {\n  background-color: #a21318 !important;\n}\n\n.materialize-red-text.text-darken-3 {\n  color: #a21318 !important;\n}\n\n.materialize-red.darken-4 {\n  background-color: #8b1014 !important;\n}\n\n.materialize-red-text.text-darken-4 {\n  color: #8b1014 !important;\n}\n\n.red {\n  background-color: #F44336 !important;\n}\n\n.red-text {\n  color: #F44336 !important;\n}\n\n.red.lighten-5 {\n  background-color: #FFEBEE !important;\n}\n\n.red-text.text-lighten-5 {\n  color: #FFEBEE !important;\n}\n\n.red.lighten-4 {\n  background-color: #FFCDD2 !important;\n}\n\n.red-text.text-lighten-4 {\n  color: #FFCDD2 !important;\n}\n\n.red.lighten-3 {\n  background-color: #EF9A9A !important;\n}\n\n.red-text.text-lighten-3 {\n  color: #EF9A9A !important;\n}\n\n.red.lighten-2 {\n  background-color: #E57373 !important;\n}\n\n.red-text.text-lighten-2 {\n  color: #E57373 !important;\n}\n\n.red.lighten-1 {\n  background-color: #EF5350 !important;\n}\n\n.red-text.text-lighten-1 {\n  color: #EF5350 !important;\n}\n\n.red.darken-1 {\n  background-color: #E53935 !important;\n}\n\n.red-text.text-darken-1 {\n  color: #E53935 !important;\n}\n\n.red.darken-2 {\n  background-color: #D32F2F !important;\n}\n\n.red-text.text-darken-2 {\n  color: #D32F2F !important;\n}\n\n.red.darken-3 {\n  background-color: #C62828 !important;\n}\n\n.red-text.text-darken-3 {\n  color: #C62828 !important;\n}\n\n.red.darken-4 {\n  background-color: #B71C1C !important;\n}\n\n.red-text.text-darken-4 {\n  color: #B71C1C !important;\n}\n\n.red.accent-1 {\n  background-color: #FF8A80 !important;\n}\n\n.red-text.text-accent-1 {\n  color: #FF8A80 !important;\n}\n\n.red.accent-2 {\n  background-color: #FF5252 !important;\n}\n\n.red-text.text-accent-2 {\n  color: #FF5252 !important;\n}\n\n.red.accent-3 {\n  background-color: #FF1744 !important;\n}\n\n.red-text.text-accent-3 {\n  color: #FF1744 !important;\n}\n\n.red.accent-4 {\n  background-color: #D50000 !important;\n}\n\n.red-text.text-accent-4 {\n  color: #D50000 !important;\n}\n\n.pink {\n  background-color: #e91e63 !important;\n}\n\n.pink-text {\n  color: #e91e63 !important;\n}\n\n.pink.lighten-5 {\n  background-color: #fce4ec !important;\n}\n\n.pink-text.text-lighten-5 {\n  color: #fce4ec !important;\n}\n\n.pink.lighten-4 {\n  background-color: #f8bbd0 !important;\n}\n\n.pink-text.text-lighten-4 {\n  color: #f8bbd0 !important;\n}\n\n.pink.lighten-3 {\n  background-color: #f48fb1 !important;\n}\n\n.pink-text.text-lighten-3 {\n  color: #f48fb1 !important;\n}\n\n.pink.lighten-2 {\n  background-color: #f06292 !important;\n}\n\n.pink-text.text-lighten-2 {\n  color: #f06292 !important;\n}\n\n.pink.lighten-1 {\n  background-color: #ec407a !important;\n}\n\n.pink-text.text-lighten-1 {\n  color: #ec407a !important;\n}\n\n.pink.darken-1 {\n  background-color: #d81b60 !important;\n}\n\n.pink-text.text-darken-1 {\n  color: #d81b60 !important;\n}\n\n.pink.darken-2 {\n  background-color: #c2185b !important;\n}\n\n.pink-text.text-darken-2 {\n  color: #c2185b !important;\n}\n\n.pink.darken-3 {\n  background-color: #ad1457 !important;\n}\n\n.pink-text.text-darken-3 {\n  color: #ad1457 !important;\n}\n\n.pink.darken-4 {\n  background-color: #880e4f !important;\n}\n\n.pink-text.text-darken-4 {\n  color: #880e4f !important;\n}\n\n.pink.accent-1 {\n  background-color: #ff80ab !important;\n}\n\n.pink-text.text-accent-1 {\n  color: #ff80ab !important;\n}\n\n.pink.accent-2 {\n  background-color: #ff4081 !important;\n}\n\n.pink-text.text-accent-2 {\n  color: #ff4081 !important;\n}\n\n.pink.accent-3 {\n  background-color: #f50057 !important;\n}\n\n.pink-text.text-accent-3 {\n  color: #f50057 !important;\n}\n\n.pink.accent-4 {\n  background-color: #c51162 !important;\n}\n\n.pink-text.text-accent-4 {\n  color: #c51162 !important;\n}\n\n.purple {\n  background-color: #9c27b0 !important;\n}\n\n.purple-text {\n  color: #9c27b0 !important;\n}\n\n.purple.lighten-5 {\n  background-color: #f3e5f5 !important;\n}\n\n.purple-text.text-lighten-5 {\n  color: #f3e5f5 !important;\n}\n\n.purple.lighten-4 {\n  background-color: #e1bee7 !important;\n}\n\n.purple-text.text-lighten-4 {\n  color: #e1bee7 !important;\n}\n\n.purple.lighten-3 {\n  background-color: #ce93d8 !important;\n}\n\n.purple-text.text-lighten-3 {\n  color: #ce93d8 !important;\n}\n\n.purple.lighten-2 {\n  background-color: #ba68c8 !important;\n}\n\n.purple-text.text-lighten-2 {\n  color: #ba68c8 !important;\n}\n\n.purple.lighten-1 {\n  background-color: #ab47bc !important;\n}\n\n.purple-text.text-lighten-1 {\n  color: #ab47bc !important;\n}\n\n.purple.darken-1 {\n  background-color: #8e24aa !important;\n}\n\n.purple-text.text-darken-1 {\n  color: #8e24aa !important;\n}\n\n.purple.darken-2 {\n  background-color: #7b1fa2 !important;\n}\n\n.purple-text.text-darken-2 {\n  color: #7b1fa2 !important;\n}\n\n.purple.darken-3 {\n  background-color: #6a1b9a !important;\n}\n\n.purple-text.text-darken-3 {\n  color: #6a1b9a !important;\n}\n\n.purple.darken-4 {\n  background-color: #4a148c !important;\n}\n\n.purple-text.text-darken-4 {\n  color: #4a148c !important;\n}\n\n.purple.accent-1 {\n  background-color: #ea80fc !important;\n}\n\n.purple-text.text-accent-1 {\n  color: #ea80fc !important;\n}\n\n.purple.accent-2 {\n  background-color: #e040fb !important;\n}\n\n.purple-text.text-accent-2 {\n  color: #e040fb !important;\n}\n\n.purple.accent-3 {\n  background-color: #d500f9 !important;\n}\n\n.purple-text.text-accent-3 {\n  color: #d500f9 !important;\n}\n\n.purple.accent-4 {\n  background-color: #aa00ff !important;\n}\n\n.purple-text.text-accent-4 {\n  color: #aa00ff !important;\n}\n\n.deep-purple {\n  background-color: #673ab7 !important;\n}\n\n.deep-purple-text {\n  color: #673ab7 !important;\n}\n\n.deep-purple.lighten-5 {\n  background-color: #ede7f6 !important;\n}\n\n.deep-purple-text.text-lighten-5 {\n  color: #ede7f6 !important;\n}\n\n.deep-purple.lighten-4 {\n  background-color: #d1c4e9 !important;\n}\n\n.deep-purple-text.text-lighten-4 {\n  color: #d1c4e9 !important;\n}\n\n.deep-purple.lighten-3 {\n  background-color: #b39ddb !important;\n}\n\n.deep-purple-text.text-lighten-3 {\n  color: #b39ddb !important;\n}\n\n.deep-purple.lighten-2 {\n  background-color: #9575cd !important;\n}\n\n.deep-purple-text.text-lighten-2 {\n  color: #9575cd !important;\n}\n\n.deep-purple.lighten-1 {\n  background-color: #7e57c2 !important;\n}\n\n.deep-purple-text.text-lighten-1 {\n  color: #7e57c2 !important;\n}\n\n.deep-purple.darken-1 {\n  background-color: #5e35b1 !important;\n}\n\n.deep-purple-text.text-darken-1 {\n  color: #5e35b1 !important;\n}\n\n.deep-purple.darken-2 {\n  background-color: #512da8 !important;\n}\n\n.deep-purple-text.text-darken-2 {\n  color: #512da8 !important;\n}\n\n.deep-purple.darken-3 {\n  background-color: #4527a0 !important;\n}\n\n.deep-purple-text.text-darken-3 {\n  color: #4527a0 !important;\n}\n\n.deep-purple.darken-4 {\n  background-color: #311b92 !important;\n}\n\n.deep-purple-text.text-darken-4 {\n  color: #311b92 !important;\n}\n\n.deep-purple.accent-1 {\n  background-color: #b388ff !important;\n}\n\n.deep-purple-text.text-accent-1 {\n  color: #b388ff !important;\n}\n\n.deep-purple.accent-2 {\n  background-color: #7c4dff !important;\n}\n\n.deep-purple-text.text-accent-2 {\n  color: #7c4dff !important;\n}\n\n.deep-purple.accent-3 {\n  background-color: #651fff !important;\n}\n\n.deep-purple-text.text-accent-3 {\n  color: #651fff !important;\n}\n\n.deep-purple.accent-4 {\n  background-color: #6200ea !important;\n}\n\n.deep-purple-text.text-accent-4 {\n  color: #6200ea !important;\n}\n\n.indigo {\n  background-color: #3f51b5 !important;\n}\n\n.indigo-text {\n  color: #3f51b5 !important;\n}\n\n.indigo.lighten-5 {\n  background-color: #e8eaf6 !important;\n}\n\n.indigo-text.text-lighten-5 {\n  color: #e8eaf6 !important;\n}\n\n.indigo.lighten-4 {\n  background-color: #c5cae9 !important;\n}\n\n.indigo-text.text-lighten-4 {\n  color: #c5cae9 !important;\n}\n\n.indigo.lighten-3 {\n  background-color: #9fa8da !important;\n}\n\n.indigo-text.text-lighten-3 {\n  color: #9fa8da !important;\n}\n\n.indigo.lighten-2 {\n  background-color: #7986cb !important;\n}\n\n.indigo-text.text-lighten-2 {\n  color: #7986cb !important;\n}\n\n.indigo.lighten-1 {\n  background-color: #5c6bc0 !important;\n}\n\n.indigo-text.text-lighten-1 {\n  color: #5c6bc0 !important;\n}\n\n.indigo.darken-1 {\n  background-color: #3949ab !important;\n}\n\n.indigo-text.text-darken-1 {\n  color: #3949ab !important;\n}\n\n.indigo.darken-2 {\n  background-color: #303f9f !important;\n}\n\n.indigo-text.text-darken-2 {\n  color: #303f9f !important;\n}\n\n.indigo.darken-3 {\n  background-color: #283593 !important;\n}\n\n.indigo-text.text-darken-3 {\n  color: #283593 !important;\n}\n\n.indigo.darken-4 {\n  background-color: #1a237e !important;\n}\n\n.indigo-text.text-darken-4 {\n  color: #1a237e !important;\n}\n\n.indigo.accent-1 {\n  background-color: #8c9eff !important;\n}\n\n.indigo-text.text-accent-1 {\n  color: #8c9eff !important;\n}\n\n.indigo.accent-2 {\n  background-color: #536dfe !important;\n}\n\n.indigo-text.text-accent-2 {\n  color: #536dfe !important;\n}\n\n.indigo.accent-3 {\n  background-color: #3d5afe !important;\n}\n\n.indigo-text.text-accent-3 {\n  color: #3d5afe !important;\n}\n\n.indigo.accent-4 {\n  background-color: #304ffe !important;\n}\n\n.indigo-text.text-accent-4 {\n  color: #304ffe !important;\n}\n\n.blue {\n  background-color: #2196F3 !important;\n}\n\n.blue-text {\n  color: #2196F3 !important;\n}\n\n.blue.lighten-5 {\n  background-color: #E3F2FD !important;\n}\n\n.blue-text.text-lighten-5 {\n  color: #E3F2FD !important;\n}\n\n.blue.lighten-4 {\n  background-color: #BBDEFB !important;\n}\n\n.blue-text.text-lighten-4 {\n  color: #BBDEFB !important;\n}\n\n.blue.lighten-3 {\n  background-color: #90CAF9 !important;\n}\n\n.blue-text.text-lighten-3 {\n  color: #90CAF9 !important;\n}\n\n.blue.lighten-2 {\n  background-color: #64B5F6 !important;\n}\n\n.blue-text.text-lighten-2 {\n  color: #64B5F6 !important;\n}\n\n.blue.lighten-1 {\n  background-color: #42A5F5 !important;\n}\n\n.blue-text.text-lighten-1 {\n  color: #42A5F5 !important;\n}\n\n.blue.darken-1 {\n  background-color: #1E88E5 !important;\n}\n\n.blue-text.text-darken-1 {\n  color: #1E88E5 !important;\n}\n\n.blue.darken-2 {\n  background-color: #1976D2 !important;\n}\n\n.blue-text.text-darken-2 {\n  color: #1976D2 !important;\n}\n\n.blue.darken-3 {\n  background-color: #1565C0 !important;\n}\n\n.blue-text.text-darken-3 {\n  color: #1565C0 !important;\n}\n\n.blue.darken-4 {\n  background-color: #0D47A1 !important;\n}\n\n.blue-text.text-darken-4 {\n  color: #0D47A1 !important;\n}\n\n.blue.accent-1 {\n  background-color: #82B1FF !important;\n}\n\n.blue-text.text-accent-1 {\n  color: #82B1FF !important;\n}\n\n.blue.accent-2 {\n  background-color: #448AFF !important;\n}\n\n.blue-text.text-accent-2 {\n  color: #448AFF !important;\n}\n\n.blue.accent-3 {\n  background-color: #2979FF !important;\n}\n\n.blue-text.text-accent-3 {\n  color: #2979FF !important;\n}\n\n.blue.accent-4 {\n  background-color: #2962FF !important;\n}\n\n.blue-text.text-accent-4 {\n  color: #2962FF !important;\n}\n\n.light-blue {\n  background-color: #03a9f4 !important;\n}\n\n.light-blue-text {\n  color: #03a9f4 !important;\n}\n\n.light-blue.lighten-5 {\n  background-color: #e1f5fe !important;\n}\n\n.light-blue-text.text-lighten-5 {\n  color: #e1f5fe !important;\n}\n\n.light-blue.lighten-4 {\n  background-color: #b3e5fc !important;\n}\n\n.light-blue-text.text-lighten-4 {\n  color: #b3e5fc !important;\n}\n\n.light-blue.lighten-3 {\n  background-color: #81d4fa !important;\n}\n\n.light-blue-text.text-lighten-3 {\n  color: #81d4fa !important;\n}\n\n.light-blue.lighten-2 {\n  background-color: #4fc3f7 !important;\n}\n\n.light-blue-text.text-lighten-2 {\n  color: #4fc3f7 !important;\n}\n\n.light-blue.lighten-1 {\n  background-color: #29b6f6 !important;\n}\n\n.light-blue-text.text-lighten-1 {\n  color: #29b6f6 !important;\n}\n\n.light-blue.darken-1 {\n  background-color: #039be5 !important;\n}\n\n.light-blue-text.text-darken-1 {\n  color: #039be5 !important;\n}\n\n.light-blue.darken-2 {\n  background-color: #0288d1 !important;\n}\n\n.light-blue-text.text-darken-2 {\n  color: #0288d1 !important;\n}\n\n.light-blue.darken-3 {\n  background-color: #0277bd !important;\n}\n\n.light-blue-text.text-darken-3 {\n  color: #0277bd !important;\n}\n\n.light-blue.darken-4 {\n  background-color: #01579b !important;\n}\n\n.light-blue-text.text-darken-4 {\n  color: #01579b !important;\n}\n\n.light-blue.accent-1 {\n  background-color: #80d8ff !important;\n}\n\n.light-blue-text.text-accent-1 {\n  color: #80d8ff !important;\n}\n\n.light-blue.accent-2 {\n  background-color: #40c4ff !important;\n}\n\n.light-blue-text.text-accent-2 {\n  color: #40c4ff !important;\n}\n\n.light-blue.accent-3 {\n  background-color: #00b0ff !important;\n}\n\n.light-blue-text.text-accent-3 {\n  color: #00b0ff !important;\n}\n\n.light-blue.accent-4 {\n  background-color: #0091ea !important;\n}\n\n.light-blue-text.text-accent-4 {\n  color: #0091ea !important;\n}\n\n.cyan {\n  background-color: #00bcd4 !important;\n}\n\n.cyan-text {\n  color: #00bcd4 !important;\n}\n\n.cyan.lighten-5 {\n  background-color: #e0f7fa !important;\n}\n\n.cyan-text.text-lighten-5 {\n  color: #e0f7fa !important;\n}\n\n.cyan.lighten-4 {\n  background-color: #b2ebf2 !important;\n}\n\n.cyan-text.text-lighten-4 {\n  color: #b2ebf2 !important;\n}\n\n.cyan.lighten-3 {\n  background-color: #80deea !important;\n}\n\n.cyan-text.text-lighten-3 {\n  color: #80deea !important;\n}\n\n.cyan.lighten-2 {\n  background-color: #4dd0e1 !important;\n}\n\n.cyan-text.text-lighten-2 {\n  color: #4dd0e1 !important;\n}\n\n.cyan.lighten-1 {\n  background-color: #26c6da !important;\n}\n\n.cyan-text.text-lighten-1 {\n  color: #26c6da !important;\n}\n\n.cyan.darken-1 {\n  background-color: #00acc1 !important;\n}\n\n.cyan-text.text-darken-1 {\n  color: #00acc1 !important;\n}\n\n.cyan.darken-2 {\n  background-color: #0097a7 !important;\n}\n\n.cyan-text.text-darken-2 {\n  color: #0097a7 !important;\n}\n\n.cyan.darken-3 {\n  background-color: #00838f !important;\n}\n\n.cyan-text.text-darken-3 {\n  color: #00838f !important;\n}\n\n.cyan.darken-4 {\n  background-color: #006064 !important;\n}\n\n.cyan-text.text-darken-4 {\n  color: #006064 !important;\n}\n\n.cyan.accent-1 {\n  background-color: #84ffff !important;\n}\n\n.cyan-text.text-accent-1 {\n  color: #84ffff !important;\n}\n\n.cyan.accent-2 {\n  background-color: #18ffff !important;\n}\n\n.cyan-text.text-accent-2 {\n  color: #18ffff !important;\n}\n\n.cyan.accent-3 {\n  background-color: #00e5ff !important;\n}\n\n.cyan-text.text-accent-3 {\n  color: #00e5ff !important;\n}\n\n.cyan.accent-4 {\n  background-color: #00b8d4 !important;\n}\n\n.cyan-text.text-accent-4 {\n  color: #00b8d4 !important;\n}\n\n.teal {\n  background-color: #009688 !important;\n}\n\n.teal-text {\n  color: #009688 !important;\n}\n\n.teal.lighten-5 {\n  background-color: #e0f2f1 !important;\n}\n\n.teal-text.text-lighten-5 {\n  color: #e0f2f1 !important;\n}\n\n.teal.lighten-4 {\n  background-color: #b2dfdb !important;\n}\n\n.teal-text.text-lighten-4 {\n  color: #b2dfdb !important;\n}\n\n.teal.lighten-3 {\n  background-color: #80cbc4 !important;\n}\n\n.teal-text.text-lighten-3 {\n  color: #80cbc4 !important;\n}\n\n.teal.lighten-2 {\n  background-color: #4db6ac !important;\n}\n\n.teal-text.text-lighten-2 {\n  color: #4db6ac !important;\n}\n\n.teal.lighten-1 {\n  background-color: #26a69a !important;\n}\n\n.teal-text.text-lighten-1 {\n  color: #26a69a !important;\n}\n\n.teal.darken-1 {\n  background-color: #00897b !important;\n}\n\n.teal-text.text-darken-1 {\n  color: #00897b !important;\n}\n\n.teal.darken-2 {\n  background-color: #00796b !important;\n}\n\n.teal-text.text-darken-2 {\n  color: #00796b !important;\n}\n\n.teal.darken-3 {\n  background-color: #00695c !important;\n}\n\n.teal-text.text-darken-3 {\n  color: #00695c !important;\n}\n\n.teal.darken-4 {\n  background-color: #004d40 !important;\n}\n\n.teal-text.text-darken-4 {\n  color: #004d40 !important;\n}\n\n.teal.accent-1 {\n  background-color: #a7ffeb !important;\n}\n\n.teal-text.text-accent-1 {\n  color: #a7ffeb !important;\n}\n\n.teal.accent-2 {\n  background-color: #64ffda !important;\n}\n\n.teal-text.text-accent-2 {\n  color: #64ffda !important;\n}\n\n.teal.accent-3 {\n  background-color: #1de9b6 !important;\n}\n\n.teal-text.text-accent-3 {\n  color: #1de9b6 !important;\n}\n\n.teal.accent-4 {\n  background-color: #00bfa5 !important;\n}\n\n.teal-text.text-accent-4 {\n  color: #00bfa5 !important;\n}\n\n.green {\n  background-color: #4CAF50 !important;\n}\n\n.green-text {\n  color: #4CAF50 !important;\n}\n\n.green.lighten-5 {\n  background-color: #E8F5E9 !important;\n}\n\n.green-text.text-lighten-5 {\n  color: #E8F5E9 !important;\n}\n\n.green.lighten-4 {\n  background-color: #C8E6C9 !important;\n}\n\n.green-text.text-lighten-4 {\n  color: #C8E6C9 !important;\n}\n\n.green.lighten-3 {\n  background-color: #A5D6A7 !important;\n}\n\n.green-text.text-lighten-3 {\n  color: #A5D6A7 !important;\n}\n\n.green.lighten-2 {\n  background-color: #81C784 !important;\n}\n\n.green-text.text-lighten-2 {\n  color: #81C784 !important;\n}\n\n.green.lighten-1 {\n  background-color: #66BB6A !important;\n}\n\n.green-text.text-lighten-1 {\n  color: #66BB6A !important;\n}\n\n.green.darken-1 {\n  background-color: #43A047 !important;\n}\n\n.green-text.text-darken-1 {\n  color: #43A047 !important;\n}\n\n.green.darken-2 {\n  background-color: #388E3C !important;\n}\n\n.green-text.text-darken-2 {\n  color: #388E3C !important;\n}\n\n.green.darken-3 {\n  background-color: #2E7D32 !important;\n}\n\n.green-text.text-darken-3 {\n  color: #2E7D32 !important;\n}\n\n.green.darken-4 {\n  background-color: #1B5E20 !important;\n}\n\n.green-text.text-darken-4 {\n  color: #1B5E20 !important;\n}\n\n.green.accent-1 {\n  background-color: #B9F6CA !important;\n}\n\n.green-text.text-accent-1 {\n  color: #B9F6CA !important;\n}\n\n.green.accent-2 {\n  background-color: #69F0AE !important;\n}\n\n.green-text.text-accent-2 {\n  color: #69F0AE !important;\n}\n\n.green.accent-3 {\n  background-color: #00E676 !important;\n}\n\n.green-text.text-accent-3 {\n  color: #00E676 !important;\n}\n\n.green.accent-4 {\n  background-color: #00C853 !important;\n}\n\n.green-text.text-accent-4 {\n  color: #00C853 !important;\n}\n\n.light-green {\n  background-color: #8bc34a !important;\n}\n\n.light-green-text {\n  color: #8bc34a !important;\n}\n\n.light-green.lighten-5 {\n  background-color: #f1f8e9 !important;\n}\n\n.light-green-text.text-lighten-5 {\n  color: #f1f8e9 !important;\n}\n\n.light-green.lighten-4 {\n  background-color: #dcedc8 !important;\n}\n\n.light-green-text.text-lighten-4 {\n  color: #dcedc8 !important;\n}\n\n.light-green.lighten-3 {\n  background-color: #c5e1a5 !important;\n}\n\n.light-green-text.text-lighten-3 {\n  color: #c5e1a5 !important;\n}\n\n.light-green.lighten-2 {\n  background-color: #aed581 !important;\n}\n\n.light-green-text.text-lighten-2 {\n  color: #aed581 !important;\n}\n\n.light-green.lighten-1 {\n  background-color: #9ccc65 !important;\n}\n\n.light-green-text.text-lighten-1 {\n  color: #9ccc65 !important;\n}\n\n.light-green.darken-1 {\n  background-color: #7cb342 !important;\n}\n\n.light-green-text.text-darken-1 {\n  color: #7cb342 !important;\n}\n\n.light-green.darken-2 {\n  background-color: #689f38 !important;\n}\n\n.light-green-text.text-darken-2 {\n  color: #689f38 !important;\n}\n\n.light-green.darken-3 {\n  background-color: #558b2f !important;\n}\n\n.light-green-text.text-darken-3 {\n  color: #558b2f !important;\n}\n\n.light-green.darken-4 {\n  background-color: #33691e !important;\n}\n\n.light-green-text.text-darken-4 {\n  color: #33691e !important;\n}\n\n.light-green.accent-1 {\n  background-color: #ccff90 !important;\n}\n\n.light-green-text.text-accent-1 {\n  color: #ccff90 !important;\n}\n\n.light-green.accent-2 {\n  background-color: #b2ff59 !important;\n}\n\n.light-green-text.text-accent-2 {\n  color: #b2ff59 !important;\n}\n\n.light-green.accent-3 {\n  background-color: #76ff03 !important;\n}\n\n.light-green-text.text-accent-3 {\n  color: #76ff03 !important;\n}\n\n.light-green.accent-4 {\n  background-color: #64dd17 !important;\n}\n\n.light-green-text.text-accent-4 {\n  color: #64dd17 !important;\n}\n\n.lime {\n  background-color: #cddc39 !important;\n}\n\n.lime-text {\n  color: #cddc39 !important;\n}\n\n.lime.lighten-5 {\n  background-color: #f9fbe7 !important;\n}\n\n.lime-text.text-lighten-5 {\n  color: #f9fbe7 !important;\n}\n\n.lime.lighten-4 {\n  background-color: #f0f4c3 !important;\n}\n\n.lime-text.text-lighten-4 {\n  color: #f0f4c3 !important;\n}\n\n.lime.lighten-3 {\n  background-color: #e6ee9c !important;\n}\n\n.lime-text.text-lighten-3 {\n  color: #e6ee9c !important;\n}\n\n.lime.lighten-2 {\n  background-color: #dce775 !important;\n}\n\n.lime-text.text-lighten-2 {\n  color: #dce775 !important;\n}\n\n.lime.lighten-1 {\n  background-color: #d4e157 !important;\n}\n\n.lime-text.text-lighten-1 {\n  color: #d4e157 !important;\n}\n\n.lime.darken-1 {\n  background-color: #c0ca33 !important;\n}\n\n.lime-text.text-darken-1 {\n  color: #c0ca33 !important;\n}\n\n.lime.darken-2 {\n  background-color: #afb42b !important;\n}\n\n.lime-text.text-darken-2 {\n  color: #afb42b !important;\n}\n\n.lime.darken-3 {\n  background-color: #9e9d24 !important;\n}\n\n.lime-text.text-darken-3 {\n  color: #9e9d24 !important;\n}\n\n.lime.darken-4 {\n  background-color: #827717 !important;\n}\n\n.lime-text.text-darken-4 {\n  color: #827717 !important;\n}\n\n.lime.accent-1 {\n  background-color: #f4ff81 !important;\n}\n\n.lime-text.text-accent-1 {\n  color: #f4ff81 !important;\n}\n\n.lime.accent-2 {\n  background-color: #eeff41 !important;\n}\n\n.lime-text.text-accent-2 {\n  color: #eeff41 !important;\n}\n\n.lime.accent-3 {\n  background-color: #c6ff00 !important;\n}\n\n.lime-text.text-accent-3 {\n  color: #c6ff00 !important;\n}\n\n.lime.accent-4 {\n  background-color: #aeea00 !important;\n}\n\n.lime-text.text-accent-4 {\n  color: #aeea00 !important;\n}\n\n.yellow {\n  background-color: #ffeb3b !important;\n}\n\n.yellow-text {\n  color: #ffeb3b !important;\n}\n\n.yellow.lighten-5 {\n  background-color: #fffde7 !important;\n}\n\n.yellow-text.text-lighten-5 {\n  color: #fffde7 !important;\n}\n\n.yellow.lighten-4 {\n  background-color: #fff9c4 !important;\n}\n\n.yellow-text.text-lighten-4 {\n  color: #fff9c4 !important;\n}\n\n.yellow.lighten-3 {\n  background-color: #fff59d !important;\n}\n\n.yellow-text.text-lighten-3 {\n  color: #fff59d !important;\n}\n\n.yellow.lighten-2 {\n  background-color: #fff176 !important;\n}\n\n.yellow-text.text-lighten-2 {\n  color: #fff176 !important;\n}\n\n.yellow.lighten-1 {\n  background-color: #ffee58 !important;\n}\n\n.yellow-text.text-lighten-1 {\n  color: #ffee58 !important;\n}\n\n.yellow.darken-1 {\n  background-color: #fdd835 !important;\n}\n\n.yellow-text.text-darken-1 {\n  color: #fdd835 !important;\n}\n\n.yellow.darken-2 {\n  background-color: #fbc02d !important;\n}\n\n.yellow-text.text-darken-2 {\n  color: #fbc02d !important;\n}\n\n.yellow.darken-3 {\n  background-color: #f9a825 !important;\n}\n\n.yellow-text.text-darken-3 {\n  color: #f9a825 !important;\n}\n\n.yellow.darken-4 {\n  background-color: #f57f17 !important;\n}\n\n.yellow-text.text-darken-4 {\n  color: #f57f17 !important;\n}\n\n.yellow.accent-1 {\n  background-color: #ffff8d !important;\n}\n\n.yellow-text.text-accent-1 {\n  color: #ffff8d !important;\n}\n\n.yellow.accent-2 {\n  background-color: #ffff00 !important;\n}\n\n.yellow-text.text-accent-2 {\n  color: #ffff00 !important;\n}\n\n.yellow.accent-3 {\n  background-color: #ffea00 !important;\n}\n\n.yellow-text.text-accent-3 {\n  color: #ffea00 !important;\n}\n\n.yellow.accent-4 {\n  background-color: #ffd600 !important;\n}\n\n.yellow-text.text-accent-4 {\n  color: #ffd600 !important;\n}\n\n.amber {\n  background-color: #ffc107 !important;\n}\n\n.amber-text {\n  color: #ffc107 !important;\n}\n\n.amber.lighten-5 {\n  background-color: #fff8e1 !important;\n}\n\n.amber-text.text-lighten-5 {\n  color: #fff8e1 !important;\n}\n\n.amber.lighten-4 {\n  background-color: #ffecb3 !important;\n}\n\n.amber-text.text-lighten-4 {\n  color: #ffecb3 !important;\n}\n\n.amber.lighten-3 {\n  background-color: #ffe082 !important;\n}\n\n.amber-text.text-lighten-3 {\n  color: #ffe082 !important;\n}\n\n.amber.lighten-2 {\n  background-color: #ffd54f !important;\n}\n\n.amber-text.text-lighten-2 {\n  color: #ffd54f !important;\n}\n\n.amber.lighten-1 {\n  background-color: #ffca28 !important;\n}\n\n.amber-text.text-lighten-1 {\n  color: #ffca28 !important;\n}\n\n.amber.darken-1 {\n  background-color: #ffb300 !important;\n}\n\n.amber-text.text-darken-1 {\n  color: #ffb300 !important;\n}\n\n.amber.darken-2 {\n  background-color: #ffa000 !important;\n}\n\n.amber-text.text-darken-2 {\n  color: #ffa000 !important;\n}\n\n.amber.darken-3 {\n  background-color: #ff8f00 !important;\n}\n\n.amber-text.text-darken-3 {\n  color: #ff8f00 !important;\n}\n\n.amber.darken-4 {\n  background-color: #ff6f00 !important;\n}\n\n.amber-text.text-darken-4 {\n  color: #ff6f00 !important;\n}\n\n.amber.accent-1 {\n  background-color: #ffe57f !important;\n}\n\n.amber-text.text-accent-1 {\n  color: #ffe57f !important;\n}\n\n.amber.accent-2 {\n  background-color: #ffd740 !important;\n}\n\n.amber-text.text-accent-2 {\n  color: #ffd740 !important;\n}\n\n.amber.accent-3 {\n  background-color: #ffc400 !important;\n}\n\n.amber-text.text-accent-3 {\n  color: #ffc400 !important;\n}\n\n.amber.accent-4 {\n  background-color: #ffab00 !important;\n}\n\n.amber-text.text-accent-4 {\n  color: #ffab00 !important;\n}\n\n.orange {\n  background-color: #ff9800 !important;\n}\n\n.orange-text {\n  color: #ff9800 !important;\n}\n\n.orange.lighten-5 {\n  background-color: #fff3e0 !important;\n}\n\n.orange-text.text-lighten-5 {\n  color: #fff3e0 !important;\n}\n\n.orange.lighten-4 {\n  background-color: #ffe0b2 !important;\n}\n\n.orange-text.text-lighten-4 {\n  color: #ffe0b2 !important;\n}\n\n.orange.lighten-3 {\n  background-color: #ffcc80 !important;\n}\n\n.orange-text.text-lighten-3 {\n  color: #ffcc80 !important;\n}\n\n.orange.lighten-2 {\n  background-color: #ffb74d !important;\n}\n\n.orange-text.text-lighten-2 {\n  color: #ffb74d !important;\n}\n\n.orange.lighten-1 {\n  background-color: #ffa726 !important;\n}\n\n.orange-text.text-lighten-1 {\n  color: #ffa726 !important;\n}\n\n.orange.darken-1 {\n  background-color: #fb8c00 !important;\n}\n\n.orange-text.text-darken-1 {\n  color: #fb8c00 !important;\n}\n\n.orange.darken-2 {\n  background-color: #f57c00 !important;\n}\n\n.orange-text.text-darken-2 {\n  color: #f57c00 !important;\n}\n\n.orange.darken-3 {\n  background-color: #ef6c00 !important;\n}\n\n.orange-text.text-darken-3 {\n  color: #ef6c00 !important;\n}\n\n.orange.darken-4 {\n  background-color: #e65100 !important;\n}\n\n.orange-text.text-darken-4 {\n  color: #e65100 !important;\n}\n\n.orange.accent-1 {\n  background-color: #ffd180 !important;\n}\n\n.orange-text.text-accent-1 {\n  color: #ffd180 !important;\n}\n\n.orange.accent-2 {\n  background-color: #ffab40 !important;\n}\n\n.orange-text.text-accent-2 {\n  color: #ffab40 !important;\n}\n\n.orange.accent-3 {\n  background-color: #ff9100 !important;\n}\n\n.orange-text.text-accent-3 {\n  color: #ff9100 !important;\n}\n\n.orange.accent-4 {\n  background-color: #ff6d00 !important;\n}\n\n.orange-text.text-accent-4 {\n  color: #ff6d00 !important;\n}\n\n.deep-orange {\n  background-color: #ff5722 !important;\n}\n\n.deep-orange-text {\n  color: #ff5722 !important;\n}\n\n.deep-orange.lighten-5 {\n  background-color: #fbe9e7 !important;\n}\n\n.deep-orange-text.text-lighten-5 {\n  color: #fbe9e7 !important;\n}\n\n.deep-orange.lighten-4 {\n  background-color: #ffccbc !important;\n}\n\n.deep-orange-text.text-lighten-4 {\n  color: #ffccbc !important;\n}\n\n.deep-orange.lighten-3 {\n  background-color: #ffab91 !important;\n}\n\n.deep-orange-text.text-lighten-3 {\n  color: #ffab91 !important;\n}\n\n.deep-orange.lighten-2 {\n  background-color: #ff8a65 !important;\n}\n\n.deep-orange-text.text-lighten-2 {\n  color: #ff8a65 !important;\n}\n\n.deep-orange.lighten-1 {\n  background-color: #ff7043 !important;\n}\n\n.deep-orange-text.text-lighten-1 {\n  color: #ff7043 !important;\n}\n\n.deep-orange.darken-1 {\n  background-color: #f4511e !important;\n}\n\n.deep-orange-text.text-darken-1 {\n  color: #f4511e !important;\n}\n\n.deep-orange.darken-2 {\n  background-color: #e64a19 !important;\n}\n\n.deep-orange-text.text-darken-2 {\n  color: #e64a19 !important;\n}\n\n.deep-orange.darken-3 {\n  background-color: #d84315 !important;\n}\n\n.deep-orange-text.text-darken-3 {\n  color: #d84315 !important;\n}\n\n.deep-orange.darken-4 {\n  background-color: #bf360c !important;\n}\n\n.deep-orange-text.text-darken-4 {\n  color: #bf360c !important;\n}\n\n.deep-orange.accent-1 {\n  background-color: #ff9e80 !important;\n}\n\n.deep-orange-text.text-accent-1 {\n  color: #ff9e80 !important;\n}\n\n.deep-orange.accent-2 {\n  background-color: #ff6e40 !important;\n}\n\n.deep-orange-text.text-accent-2 {\n  color: #ff6e40 !important;\n}\n\n.deep-orange.accent-3 {\n  background-color: #ff3d00 !important;\n}\n\n.deep-orange-text.text-accent-3 {\n  color: #ff3d00 !important;\n}\n\n.deep-orange.accent-4 {\n  background-color: #dd2c00 !important;\n}\n\n.deep-orange-text.text-accent-4 {\n  color: #dd2c00 !important;\n}\n\n.brown {\n  background-color: #795548 !important;\n}\n\n.brown-text {\n  color: #795548 !important;\n}\n\n.brown.lighten-5 {\n  background-color: #efebe9 !important;\n}\n\n.brown-text.text-lighten-5 {\n  color: #efebe9 !important;\n}\n\n.brown.lighten-4 {\n  background-color: #d7ccc8 !important;\n}\n\n.brown-text.text-lighten-4 {\n  color: #d7ccc8 !important;\n}\n\n.brown.lighten-3 {\n  background-color: #bcaaa4 !important;\n}\n\n.brown-text.text-lighten-3 {\n  color: #bcaaa4 !important;\n}\n\n.brown.lighten-2 {\n  background-color: #a1887f !important;\n}\n\n.brown-text.text-lighten-2 {\n  color: #a1887f !important;\n}\n\n.brown.lighten-1 {\n  background-color: #8d6e63 !important;\n}\n\n.brown-text.text-lighten-1 {\n  color: #8d6e63 !important;\n}\n\n.brown.darken-1 {\n  background-color: #6d4c41 !important;\n}\n\n.brown-text.text-darken-1 {\n  color: #6d4c41 !important;\n}\n\n.brown.darken-2 {\n  background-color: #5d4037 !important;\n}\n\n.brown-text.text-darken-2 {\n  color: #5d4037 !important;\n}\n\n.brown.darken-3 {\n  background-color: #4e342e !important;\n}\n\n.brown-text.text-darken-3 {\n  color: #4e342e !important;\n}\n\n.brown.darken-4 {\n  background-color: #3e2723 !important;\n}\n\n.brown-text.text-darken-4 {\n  color: #3e2723 !important;\n}\n\n.blue-grey {\n  background-color: #607d8b !important;\n}\n\n.blue-grey-text {\n  color: #607d8b !important;\n}\n\n.blue-grey.lighten-5 {\n  background-color: #eceff1 !important;\n}\n\n.blue-grey-text.text-lighten-5 {\n  color: #eceff1 !important;\n}\n\n.blue-grey.lighten-4 {\n  background-color: #cfd8dc !important;\n}\n\n.blue-grey-text.text-lighten-4 {\n  color: #cfd8dc !important;\n}\n\n.blue-grey.lighten-3 {\n  background-color: #b0bec5 !important;\n}\n\n.blue-grey-text.text-lighten-3 {\n  color: #b0bec5 !important;\n}\n\n.blue-grey.lighten-2 {\n  background-color: #90a4ae !important;\n}\n\n.blue-grey-text.text-lighten-2 {\n  color: #90a4ae !important;\n}\n\n.blue-grey.lighten-1 {\n  background-color: #78909c !important;\n}\n\n.blue-grey-text.text-lighten-1 {\n  color: #78909c !important;\n}\n\n.blue-grey.darken-1 {\n  background-color: #546e7a !important;\n}\n\n.blue-grey-text.text-darken-1 {\n  color: #546e7a !important;\n}\n\n.blue-grey.darken-2 {\n  background-color: #455a64 !important;\n}\n\n.blue-grey-text.text-darken-2 {\n  color: #455a64 !important;\n}\n\n.blue-grey.darken-3 {\n  background-color: #37474f !important;\n}\n\n.blue-grey-text.text-darken-3 {\n  color: #37474f !important;\n}\n\n.blue-grey.darken-4 {\n  background-color: #263238 !important;\n}\n\n.blue-grey-text.text-darken-4 {\n  color: #263238 !important;\n}\n\n.grey {\n  background-color: #9e9e9e !important;\n}\n\n.grey-text {\n  color: #9e9e9e !important;\n}\n\n.grey.lighten-5 {\n  background-color: #fafafa !important;\n}\n\n.grey-text.text-lighten-5 {\n  color: #fafafa !important;\n}\n\n.grey.lighten-4 {\n  background-color: #f5f5f5 !important;\n}\n\n.grey-text.text-lighten-4 {\n  color: #f5f5f5 !important;\n}\n\n.grey.lighten-3 {\n  background-color: #eeeeee !important;\n}\n\n.grey-text.text-lighten-3 {\n  color: #eeeeee !important;\n}\n\n.grey.lighten-2 {\n  background-color: #e0e0e0 !important;\n}\n\n.grey-text.text-lighten-2 {\n  color: #e0e0e0 !important;\n}\n\n.grey.lighten-1 {\n  background-color: #bdbdbd !important;\n}\n\n.grey-text.text-lighten-1 {\n  color: #bdbdbd !important;\n}\n\n.grey.darken-1 {\n  background-color: #757575 !important;\n}\n\n.grey-text.text-darken-1 {\n  color: #757575 !important;\n}\n\n.grey.darken-2 {\n  background-color: #616161 !important;\n}\n\n.grey-text.text-darken-2 {\n  color: #616161 !important;\n}\n\n.grey.darken-3 {\n  background-color: #424242 !important;\n}\n\n.grey-text.text-darken-3 {\n  color: #424242 !important;\n}\n\n.grey.darken-4 {\n  background-color: #212121 !important;\n}\n\n.grey-text.text-darken-4 {\n  color: #212121 !important;\n}\n\n.black {\n  background-color: #000000 !important;\n}\n\n.black-text {\n  color: #000000 !important;\n}\n\n.white {\n  background-color: #FFFFFF !important;\n}\n\n.white-text {\n  color: #FFFFFF !important;\n}\n\n.transparent {\n  background-color: transparent !important;\n}\n\n.transparent-text {\n  color: transparent !important;\n}\n\n/*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */\n\n/**\r\n * 1. Set default font family to sans-serif.\r\n * 2. Prevent iOS and IE text size adjust after device orientation change,\r\n *    without disabling user zoom.\r\n */\n\nhtml {\n  font-family: sans-serif;\n  /* 1 */\n  -ms-text-size-adjust: 100%;\n  /* 2 */\n  -webkit-text-size-adjust: 100%;\n  /* 2 */\n}\n\n/**\r\n * Remove default margin.\r\n */\n\nbody {\n  margin: 0;\n}\n\n/* HTML5 display definitions\r\n   ========================================================================== */\n\n/**\r\n * Correct `block` display not defined for any HTML5 element in IE 8/9.\r\n * Correct `block` display not defined for `details` or `summary` in IE 10/11\r\n * and Firefox.\r\n * Correct `block` display not defined for `main` in IE 11.\r\n */\n\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmain,\nmenu,\nnav,\nsection,\nsummary {\n  display: block;\n}\n\n/**\r\n * 1. Correct `inline-block` display not defined in IE 8/9.\r\n * 2. Normalize vertical alignment of `progress` in Chrome, Firefox, and Opera.\r\n */\n\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block;\n  /* 1 */\n  vertical-align: baseline;\n  /* 2 */\n}\n\n/**\r\n * Prevent modern browsers from displaying `audio` without controls.\r\n * Remove excess height in iOS 5 devices.\r\n */\n\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n\n/**\r\n * Address `[hidden]` styling not present in IE 8/9/10.\r\n * Hide the `template` element in IE 8/9/10/11, Safari, and Firefox < 22.\r\n */\n\n[hidden],\ntemplate {\n  display: none;\n}\n\n/* Links\r\n   ========================================================================== */\n\n/**\r\n * Remove the gray background color from active links in IE 10.\r\n */\n\na {\n  background-color: transparent;\n}\n\n/**\r\n * Improve readability of focused elements when they are also in an\r\n * active/hover state.\r\n */\n\na:active,\na:hover {\n  outline: 0;\n}\n\n/* Text-level semantics\r\n   ========================================================================== */\n\n/**\r\n * Address styling not present in IE 8/9/10/11, Safari, and Chrome.\r\n */\n\nabbr[title] {\n  border-bottom: 1px dotted;\n}\n\n/**\r\n * Address style set to `bolder` in Firefox 4+, Safari, and Chrome.\r\n */\n\nb,\nstrong {\n  font-weight: bold;\n}\n\n/**\r\n * Address styling not present in Safari and Chrome.\r\n */\n\ndfn {\n  font-style: italic;\n}\n\n/**\r\n * Address variable `h1` font-size and margin within `section` and `article`\r\n * contexts in Firefox 4+, Safari, and Chrome.\r\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/**\r\n * Address styling not present in IE 8/9.\r\n */\n\nmark {\n  background: #ff0;\n  color: #000;\n}\n\n/**\r\n * Address inconsistent and variable font size in all browsers.\r\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\r\n * Prevent `sub` and `sup` affecting `line-height` in all browsers.\r\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsup {\n  top: -0.5em;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\n/* Embedded content\r\n   ========================================================================== */\n\n/**\r\n * Remove border when inside `a` element in IE 8/9/10.\r\n */\n\nimg {\n  border: 0;\n}\n\n/**\r\n * Correct overflow not hidden in IE 9/10/11.\r\n */\n\nsvg:not(:root) {\n  overflow: hidden;\n}\n\n/* Grouping content\r\n   ========================================================================== */\n\n/**\r\n * Address margin not present in IE 8/9 and Safari.\r\n */\n\nfigure {\n  margin: 1em 40px;\n}\n\n/**\r\n * Address differences between Firefox and other browsers.\r\n */\n\nhr {\n  -webkit-box-sizing: content-box;\n          box-sizing: content-box;\n  height: 0;\n}\n\n/**\r\n * Contain overflow in all browsers.\r\n */\n\npre {\n  overflow: auto;\n}\n\n/**\r\n * Address odd `em`-unit font size rendering in all browsers.\r\n */\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em;\n}\n\n/* Forms\r\n   ========================================================================== */\n\n/**\r\n * Known limitation: by default, Chrome and Safari on OS X allow very limited\r\n * styling of `select`, unless a `border` property is set.\r\n */\n\n/**\r\n * 1. Correct color not being inherited.\r\n *    Known issue: affects color of disabled elements.\r\n * 2. Correct font properties not being inherited.\r\n * 3. Address margins set differently in Firefox 4+, Safari, and Chrome.\r\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  color: inherit;\n  /* 1 */\n  font: inherit;\n  /* 2 */\n  margin: 0;\n  /* 3 */\n}\n\n/**\r\n * Address `overflow` set to `hidden` in IE 8/9/10/11.\r\n */\n\nbutton {\n  overflow: visible;\n}\n\n/**\r\n * Address inconsistent `text-transform` inheritance for `button` and `select`.\r\n * All other form control elements do not inherit `text-transform` values.\r\n * Correct `button` style inheritance in Firefox, IE 8/9/10/11, and Opera.\r\n * Correct `select` style inheritance in Firefox.\r\n */\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/**\r\n * 1. Avoid the WebKit bug in Android 4.0.* where (2) destroys native `audio`\r\n *    and `video` controls.\r\n * 2. Correct inability to style clickable `input` types in iOS.\r\n * 3. Improve usability and consistency of cursor style between image-type\r\n *    `input` and others.\r\n */\n\nbutton,\nhtml input[type=\"button\"],\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n  -webkit-appearance: button;\n  /* 2 */\n  cursor: pointer;\n  /* 3 */\n}\n\n/**\r\n * Re-set default cursor for disabled elements.\r\n */\n\nbutton[disabled],\nhtml input[disabled] {\n  cursor: default;\n}\n\n/**\r\n * Remove inner padding and border in Firefox 4+.\r\n */\n\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n  border: 0;\n  padding: 0;\n}\n\n/**\r\n * Address Firefox 4+ setting `line-height` on `input` using `!important` in\r\n * the UA stylesheet.\r\n */\n\ninput {\n  line-height: normal;\n}\n\n/**\r\n * It's recommended that you don't attempt to style these elements.\r\n * Firefox's implementation doesn't respect box-sizing, padding, or width.\r\n *\r\n * 1. Address box sizing set to `content-box` in IE 8/9/10.\r\n * 2. Remove excess padding in IE 8/9/10.\r\n */\n\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  /* 1 */\n  padding: 0;\n  /* 2 */\n}\n\n/**\r\n * Fix the cursor style for Chrome's increment/decrement buttons. For certain\r\n * `font-size` values of the `input`, it causes the cursor style of the\r\n * decrement button to change from `default` to `text`.\r\n */\n\ninput[type=\"number\"]::-webkit-inner-spin-button,\ninput[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\r\n * 1. Address `appearance` set to `searchfield` in Safari and Chrome.\r\n * 2. Address `box-sizing` set to `border-box` in Safari and Chrome.\r\n */\n\ninput[type=\"search\"] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  -webkit-box-sizing: content-box;\n          box-sizing: content-box;\n  /* 2 */\n}\n\n/**\r\n * Remove inner padding and search cancel button in Safari and Chrome on OS X.\r\n * Safari (but not Chrome) clips the cancel button when the search input has\r\n * padding (and `textfield` appearance).\r\n */\n\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\r\n * Define consistent border, margin, and padding.\r\n */\n\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em;\n}\n\n/**\r\n * 1. Correct `color` not being inherited in IE 8/9/10/11.\r\n * 2. Remove padding so people aren't caught out if they zero out fieldsets.\r\n */\n\nlegend {\n  border: 0;\n  /* 1 */\n  padding: 0;\n  /* 2 */\n}\n\n/**\r\n * Remove default vertical scrollbar in IE 8/9/10/11.\r\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\r\n * Don't inherit the `font-weight` (applied by a rule above).\r\n * NOTE: the default cannot safely be changed in Chrome and Safari on OS X.\r\n */\n\noptgroup {\n  font-weight: bold;\n}\n\n/* Tables\r\n   ========================================================================== */\n\n/**\r\n * Remove most spacing between table cells.\r\n */\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n\ntd,\nth {\n  padding: 0;\n}\n\nhtml {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n\n*,\n*:before,\n*:after {\n  -webkit-box-sizing: inherit;\n          box-sizing: inherit;\n}\n\nul:not(.browser-default) {\n  padding-left: 0;\n  list-style-type: none;\n}\n\nul:not(.browser-default) > li {\n  list-style-type: none;\n}\n\na {\n  color: #039be5;\n  text-decoration: none;\n  -webkit-tap-highlight-color: transparent;\n}\n\n.valign-wrapper {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n\n.clearfix {\n  clear: both;\n}\n\n.z-depth-0 {\n  -webkit-box-shadow: none !important;\n          box-shadow: none !important;\n}\n\n.z-depth-1,\nnav,\n.btn,\n.btn-large,\n.btn-floating,\n.dropdown-content,\n.collapsible {\n  -webkit-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);\n          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);\n}\n\n.z-depth-1-half,\n.btn:hover,\n.btn-large:hover,\n.btn-floating:hover {\n  -webkit-box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 7px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -1px rgba(0, 0, 0, 0.2);\n          box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 7px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -1px rgba(0, 0, 0, 0.2);\n}\n\n.z-depth-2 {\n  -webkit-box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.3);\n          box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.3);\n}\n\n.z-depth-3 {\n  -webkit-box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.3);\n          box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.3);\n}\n\n.z-depth-4 {\n  -webkit-box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.3);\n          box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.3);\n}\n\n.z-depth-5 {\n  -webkit-box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.3);\n          box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.3);\n}\n\n.hoverable {\n  -webkit-transition: -webkit-box-shadow .25s;\n  transition: -webkit-box-shadow .25s;\n  -o-transition: box-shadow .25s;\n  transition: box-shadow .25s;\n  transition: box-shadow .25s, -webkit-box-shadow .25s;\n}\n\n.hoverable:hover {\n  -webkit-box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);\n          box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);\n}\n\n.divider {\n  height: 1px;\n  overflow: hidden;\n  background-color: #e0e0e0;\n}\n\nblockquote {\n  margin: 20px 0;\n  padding-left: 1.5rem;\n  border-left: 5px solid #ee6e73;\n}\n\ni {\n  line-height: inherit;\n}\n\ni.left {\n  float: left;\n  margin-right: 15px;\n}\n\ni.right {\n  float: right;\n  margin-left: 15px;\n}\n\ni.tiny {\n  font-size: 1rem;\n}\n\ni.small {\n  font-size: 2rem;\n}\n\ni.medium {\n  font-size: 4rem;\n}\n\ni.large {\n  font-size: 6rem;\n}\n\nimg.responsive-img,\nvideo.responsive-video {\n  max-width: 100%;\n  height: auto;\n}\n\n.pagination li {\n  display: inline-block;\n  border-radius: 2px;\n  text-align: center;\n  vertical-align: top;\n  height: 30px;\n}\n\n.pagination li a {\n  color: #444;\n  display: inline-block;\n  font-size: 1.2rem;\n  padding: 0 10px;\n  line-height: 30px;\n}\n\n.pagination li.active a {\n  color: #fff;\n}\n\n.pagination li.active {\n  background-color: #ee6e73;\n}\n\n.pagination li.disabled a {\n  cursor: default;\n  color: #999;\n}\n\n.pagination li i {\n  font-size: 2rem;\n}\n\n.pagination li.pages ul li {\n  display: inline-block;\n  float: none;\n}\n\n@media only screen and (max-width: 992px) {\n  .pagination {\n    width: 100%;\n  }\n\n  .pagination li.prev,\n  .pagination li.next {\n    width: 10%;\n  }\n\n  .pagination li.pages {\n    width: 80%;\n    overflow: hidden;\n    white-space: nowrap;\n  }\n}\n\n.breadcrumb {\n  font-size: 18px;\n  color: rgba(255, 255, 255, 0.7);\n}\n\n.breadcrumb i,\n.breadcrumb [class^=\"mdi-\"],\n.breadcrumb [class*=\"mdi-\"],\n.breadcrumb i.material-icons {\n  display: inline-block;\n  float: left;\n  font-size: 24px;\n}\n\n.breadcrumb:before {\n  content: '\\E5CC';\n  color: rgba(255, 255, 255, 0.7);\n  vertical-align: top;\n  display: inline-block;\n  font-family: 'Material Icons';\n  font-weight: normal;\n  font-style: normal;\n  font-size: 25px;\n  margin: 0 10px 0 8px;\n  -webkit-font-smoothing: antialiased;\n}\n\n.breadcrumb:first-child:before {\n  display: none;\n}\n\n.breadcrumb:last-child {\n  color: #fff;\n}\n\n.parallax-container {\n  position: relative;\n  overflow: hidden;\n  height: 500px;\n}\n\n.parallax-container .parallax {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: -1;\n}\n\n.parallax-container .parallax img {\n  display: none;\n  position: absolute;\n  left: 50%;\n  bottom: 0;\n  min-width: 100%;\n  min-height: 100%;\n  -webkit-transform: translate3d(0, 0, 0);\n          transform: translate3d(0, 0, 0);\n  -webkit-transform: translateX(-50%);\n       -o-transform: translateX(-50%);\n          transform: translateX(-50%);\n}\n\n.pin-top,\n.pin-bottom {\n  position: relative;\n}\n\n.pinned {\n  position: fixed !important;\n}\n\n/*********************\r\n  Transition Classes\r\n**********************/\n\nul.staggered-list li {\n  opacity: 0;\n}\n\n.fade-in {\n  opacity: 0;\n  -webkit-transform-origin: 0 50%;\n       -o-transform-origin: 0 50%;\n          transform-origin: 0 50%;\n}\n\n/*********************\r\n  Media Query Classes\r\n**********************/\n\n@media only screen and (max-width: 600px) {\n  .hide-on-small-only,\n  .hide-on-small-and-down {\n    display: none !important;\n  }\n}\n\n@media only screen and (max-width: 992px) {\n  .hide-on-med-and-down {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 601px) {\n  .hide-on-med-and-up {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 600px) and (max-width: 992px) {\n  .hide-on-med-only {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 993px) {\n  .hide-on-large-only {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 993px) {\n  .show-on-large {\n    display: block !important;\n  }\n}\n\n@media only screen and (min-width: 600px) and (max-width: 992px) {\n  .show-on-medium {\n    display: block !important;\n  }\n}\n\n@media only screen and (max-width: 600px) {\n  .show-on-small {\n    display: block !important;\n  }\n}\n\n@media only screen and (min-width: 601px) {\n  .show-on-medium-and-up {\n    display: block !important;\n  }\n}\n\n@media only screen and (max-width: 992px) {\n  .show-on-medium-and-down {\n    display: block !important;\n  }\n}\n\n@media only screen and (max-width: 600px) {\n  .center-on-small-only {\n    text-align: center;\n  }\n}\n\n.page-footer {\n  padding-top: 20px;\n  color: #fff;\n  background-color: #ee6e73;\n}\n\n.page-footer .footer-copyright {\n  overflow: hidden;\n  min-height: 50px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  padding: 10px 0px;\n  color: rgba(255, 255, 255, 0.8);\n  background-color: rgba(51, 51, 51, 0.08);\n}\n\ntable,\nth,\ntd {\n  border: none;\n}\n\ntable {\n  width: 100%;\n  display: table;\n}\n\ntable.bordered > thead > tr,\ntable.bordered > tbody > tr {\n  border-bottom: 1px solid #d0d0d0;\n}\n\ntable.striped > tbody > tr:nth-child(odd) {\n  background-color: #f2f2f2;\n}\n\ntable.striped > tbody > tr > td {\n  border-radius: 0;\n}\n\ntable.highlight > tbody > tr {\n  -webkit-transition: background-color .25s ease;\n  -o-transition: background-color .25s ease;\n  transition: background-color .25s ease;\n}\n\ntable.highlight > tbody > tr:hover {\n  background-color: #f2f2f2;\n}\n\ntable.centered thead tr th,\ntable.centered tbody tr td {\n  text-align: center;\n}\n\nthead {\n  border-bottom: 1px solid #d0d0d0;\n}\n\ntd,\nth {\n  padding: 15px 5px;\n  display: table-cell;\n  text-align: left;\n  vertical-align: middle;\n  border-radius: 2px;\n}\n\n@media only screen and (max-width: 992px) {\n  table.responsive-table {\n    width: 100%;\n    border-collapse: collapse;\n    border-spacing: 0;\n    display: block;\n    position: relative;\n    /* sort out borders */\n  }\n\n  table.responsive-table td:empty:before {\n    content: '\\A0';\n  }\n\n  table.responsive-table th,\n  table.responsive-table td {\n    margin: 0;\n    vertical-align: top;\n  }\n\n  table.responsive-table th {\n    text-align: left;\n  }\n\n  table.responsive-table thead {\n    display: block;\n    float: left;\n  }\n\n  table.responsive-table thead tr {\n    display: block;\n    padding: 0 10px 0 0;\n  }\n\n  table.responsive-table thead tr th::before {\n    content: \"\\A0\";\n  }\n\n  table.responsive-table tbody {\n    display: block;\n    width: auto;\n    position: relative;\n    overflow-x: auto;\n    white-space: nowrap;\n  }\n\n  table.responsive-table tbody tr {\n    display: inline-block;\n    vertical-align: top;\n  }\n\n  table.responsive-table th {\n    display: block;\n    text-align: right;\n  }\n\n  table.responsive-table td {\n    display: block;\n    min-height: 1.25em;\n    text-align: left;\n  }\n\n  table.responsive-table tr {\n    padding: 0 10px;\n  }\n\n  table.responsive-table thead {\n    border: 0;\n    border-right: 1px solid #d0d0d0;\n  }\n\n  table.responsive-table.bordered th {\n    border-bottom: 0;\n    border-left: 0;\n  }\n\n  table.responsive-table.bordered td {\n    border-left: 0;\n    border-right: 0;\n    border-bottom: 0;\n  }\n\n  table.responsive-table.bordered tr {\n    border: 0;\n  }\n\n  table.responsive-table.bordered tbody tr {\n    border-right: 1px solid #d0d0d0;\n  }\n}\n\n.collection {\n  margin: 0.5rem 0 1rem 0;\n  border: 1px solid #e0e0e0;\n  border-radius: 2px;\n  overflow: hidden;\n  position: relative;\n}\n\n.collection .collection-item {\n  background-color: #fff;\n  line-height: 1.5rem;\n  padding: 10px 20px;\n  margin: 0;\n  border-bottom: 1px solid #e0e0e0;\n}\n\n.collection .collection-item.avatar {\n  min-height: 84px;\n  padding-left: 72px;\n  position: relative;\n}\n\n.collection .collection-item.avatar:not(.circle-clipper) > .circle,\n.collection .collection-item.avatar :not(.circle-clipper) > .circle {\n  position: absolute;\n  width: 42px;\n  height: 42px;\n  overflow: hidden;\n  left: 15px;\n  display: inline-block;\n  vertical-align: middle;\n}\n\n.collection .collection-item.avatar i.circle {\n  font-size: 18px;\n  line-height: 42px;\n  color: #fff;\n  background-color: #999;\n  text-align: center;\n}\n\n.collection .collection-item.avatar .title {\n  font-size: 16px;\n}\n\n.collection .collection-item.avatar p {\n  margin: 0;\n}\n\n.collection .collection-item.avatar .secondary-content {\n  position: absolute;\n  top: 16px;\n  right: 16px;\n}\n\n.collection .collection-item:last-child {\n  border-bottom: none;\n}\n\n.collection .collection-item.active {\n  background-color: #26a69a;\n  color: #eafaf9;\n}\n\n.collection .collection-item.active .secondary-content {\n  color: #fff;\n}\n\n.collection a.collection-item {\n  display: block;\n  -webkit-transition: .25s;\n  -o-transition: .25s;\n  transition: .25s;\n  color: #26a69a;\n}\n\n.collection a.collection-item:not(.active):hover {\n  background-color: #ddd;\n}\n\n.collection.with-header .collection-header {\n  background-color: #fff;\n  border-bottom: 1px solid #e0e0e0;\n  padding: 10px 20px;\n}\n\n.collection.with-header .collection-item {\n  padding-left: 30px;\n}\n\n.collection.with-header .collection-item.avatar {\n  padding-left: 72px;\n}\n\n.secondary-content {\n  float: right;\n  color: #26a69a;\n}\n\n.collapsible .collection {\n  margin: 0;\n  border: none;\n}\n\n.video-container {\n  position: relative;\n  padding-bottom: 56.25%;\n  height: 0;\n  overflow: hidden;\n}\n\n.video-container iframe,\n.video-container object,\n.video-container embed {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}\n\n.progress {\n  position: relative;\n  height: 4px;\n  display: block;\n  width: 100%;\n  background-color: #acece6;\n  border-radius: 2px;\n  margin: 0.5rem 0 1rem 0;\n  overflow: hidden;\n}\n\n.progress .determinate {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  background-color: #26a69a;\n  -webkit-transition: width .3s linear;\n  -o-transition: width .3s linear;\n  transition: width .3s linear;\n}\n\n.progress .indeterminate {\n  background-color: #26a69a;\n}\n\n.progress .indeterminate:before {\n  content: '';\n  position: absolute;\n  background-color: inherit;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  will-change: left, right;\n  -webkit-animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;\n       -o-animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;\n          animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;\n}\n\n.progress .indeterminate:after {\n  content: '';\n  position: absolute;\n  background-color: inherit;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  will-change: left, right;\n  -webkit-animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;\n       -o-animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;\n          animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;\n  -webkit-animation-delay: 1.15s;\n       -o-animation-delay: 1.15s;\n          animation-delay: 1.15s;\n}\n\n@-webkit-keyframes indeterminate {\n  0% {\n    left: -35%;\n    right: 100%;\n  }\n\n  60% {\n    left: 100%;\n    right: -90%;\n  }\n\n  100% {\n    left: 100%;\n    right: -90%;\n  }\n}\n\n@-o-keyframes indeterminate {\n  0% {\n    left: -35%;\n    right: 100%;\n  }\n\n  60% {\n    left: 100%;\n    right: -90%;\n  }\n\n  100% {\n    left: 100%;\n    right: -90%;\n  }\n}\n\n@keyframes indeterminate {\n  0% {\n    left: -35%;\n    right: 100%;\n  }\n\n  60% {\n    left: 100%;\n    right: -90%;\n  }\n\n  100% {\n    left: 100%;\n    right: -90%;\n  }\n}\n\n@-webkit-keyframes indeterminate-short {\n  0% {\n    left: -200%;\n    right: 100%;\n  }\n\n  60% {\n    left: 107%;\n    right: -8%;\n  }\n\n  100% {\n    left: 107%;\n    right: -8%;\n  }\n}\n\n@-o-keyframes indeterminate-short {\n  0% {\n    left: -200%;\n    right: 100%;\n  }\n\n  60% {\n    left: 107%;\n    right: -8%;\n  }\n\n  100% {\n    left: 107%;\n    right: -8%;\n  }\n}\n\n@keyframes indeterminate-short {\n  0% {\n    left: -200%;\n    right: 100%;\n  }\n\n  60% {\n    left: 107%;\n    right: -8%;\n  }\n\n  100% {\n    left: 107%;\n    right: -8%;\n  }\n}\n\n/*******************\r\n  Utility Classes\r\n*******************/\n\n.hide {\n  display: none !important;\n}\n\n.left-align {\n  text-align: left;\n}\n\n.right-align {\n  text-align: right;\n}\n\n.center,\n.center-align {\n  text-align: center;\n}\n\n.left {\n  float: left !important;\n}\n\n.right {\n  float: right !important;\n}\n\n.no-select,\ninput[type=range],\ninput[type=range] + .thumb {\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n\n.circle {\n  border-radius: 50%;\n}\n\n.center-block {\n  display: block;\n  margin-left: auto;\n  margin-right: auto;\n}\n\n.truncate {\n  display: block;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.no-padding {\n  padding: 0 !important;\n}\n\n.container {\n  margin: 0 auto;\n  max-width: 1280px;\n  width: 90%;\n}\n\n@media only screen and (min-width: 601px) {\n  .container {\n    width: 85%;\n  }\n}\n\n@media only screen and (min-width: 993px) {\n  .container {\n    width: 70%;\n  }\n}\n\n.container .row {\n  margin-left: -0.75rem;\n  margin-right: -0.75rem;\n}\n\n.section {\n  padding-top: 1rem;\n  padding-bottom: 1rem;\n}\n\n.section.no-pad {\n  padding: 0;\n}\n\n.section.no-pad-bot {\n  padding-bottom: 0;\n}\n\n.section.no-pad-top {\n  padding-top: 0;\n}\n\n.row {\n  margin-left: auto;\n  margin-right: auto;\n  margin-bottom: 20px;\n}\n\n.row:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n\n.row .col {\n  float: left;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  padding: 0 0.75rem;\n  min-height: 1px;\n}\n\n.row .col[class*=\"push-\"],\n.row .col[class*=\"pull-\"] {\n  position: relative;\n}\n\n.row .col.s1 {\n  width: 8.33333%;\n  margin-left: auto;\n  left: auto;\n  right: auto;\n}\n\n.row .col.s2 {\n  width: 16.66667%;\n  margin-left: auto;\n  left: auto;\n  right: auto;\n}\n\n.row .col.s3 {\n  width: 25%;\n  margin-left: auto;\n  left: auto;\n  right: auto;\n}\n\n.row .col.s4 {\n  width: 33.33333%;\n  margin-left: auto;\n  left: auto;\n  right: auto;\n}\n\n.row .col.s5 {\n  width: 41.66667%;\n  margin-left: auto;\n  left: auto;\n  right: auto;\n}\n\n.row .col.s6 {\n  width: 50%;\n  margin-left: auto;\n  left: auto;\n  right: auto;\n}\n\n.row .col.s7 {\n  width: 58.33333%;\n  margin-left: auto;\n  left: auto;\n  right: auto;\n}\n\n.row .col.s8 {\n  width: 66.66667%;\n  margin-left: auto;\n  left: auto;\n  right: auto;\n}\n\n.row .col.s9 {\n  width: 75%;\n  margin-left: auto;\n  left: auto;\n  right: auto;\n}\n\n.row .col.s10 {\n  width: 83.33333%;\n  margin-left: auto;\n  left: auto;\n  right: auto;\n}\n\n.row .col.s11 {\n  width: 91.66667%;\n  margin-left: auto;\n  left: auto;\n  right: auto;\n}\n\n.row .col.s12 {\n  width: 100%;\n  margin-left: auto;\n  left: auto;\n  right: auto;\n}\n\n.row .col.offset-s1 {\n  margin-left: 8.33333%;\n}\n\n.row .col.pull-s1 {\n  right: 8.33333%;\n}\n\n.row .col.push-s1 {\n  left: 8.33333%;\n}\n\n.row .col.offset-s2 {\n  margin-left: 16.66667%;\n}\n\n.row .col.pull-s2 {\n  right: 16.66667%;\n}\n\n.row .col.push-s2 {\n  left: 16.66667%;\n}\n\n.row .col.offset-s3 {\n  margin-left: 25%;\n}\n\n.row .col.pull-s3 {\n  right: 25%;\n}\n\n.row .col.push-s3 {\n  left: 25%;\n}\n\n.row .col.offset-s4 {\n  margin-left: 33.33333%;\n}\n\n.row .col.pull-s4 {\n  right: 33.33333%;\n}\n\n.row .col.push-s4 {\n  left: 33.33333%;\n}\n\n.row .col.offset-s5 {\n  margin-left: 41.66667%;\n}\n\n.row .col.pull-s5 {\n  right: 41.66667%;\n}\n\n.row .col.push-s5 {\n  left: 41.66667%;\n}\n\n.row .col.offset-s6 {\n  margin-left: 50%;\n}\n\n.row .col.pull-s6 {\n  right: 50%;\n}\n\n.row .col.push-s6 {\n  left: 50%;\n}\n\n.row .col.offset-s7 {\n  margin-left: 58.33333%;\n}\n\n.row .col.pull-s7 {\n  right: 58.33333%;\n}\n\n.row .col.push-s7 {\n  left: 58.33333%;\n}\n\n.row .col.offset-s8 {\n  margin-left: 66.66667%;\n}\n\n.row .col.pull-s8 {\n  right: 66.66667%;\n}\n\n.row .col.push-s8 {\n  left: 66.66667%;\n}\n\n.row .col.offset-s9 {\n  margin-left: 75%;\n}\n\n.row .col.pull-s9 {\n  right: 75%;\n}\n\n.row .col.push-s9 {\n  left: 75%;\n}\n\n.row .col.offset-s10 {\n  margin-left: 83.33333%;\n}\n\n.row .col.pull-s10 {\n  right: 83.33333%;\n}\n\n.row .col.push-s10 {\n  left: 83.33333%;\n}\n\n.row .col.offset-s11 {\n  margin-left: 91.66667%;\n}\n\n.row .col.pull-s11 {\n  right: 91.66667%;\n}\n\n.row .col.push-s11 {\n  left: 91.66667%;\n}\n\n.row .col.offset-s12 {\n  margin-left: 100%;\n}\n\n.row .col.pull-s12 {\n  right: 100%;\n}\n\n.row .col.push-s12 {\n  left: 100%;\n}\n\n@media only screen and (min-width: 601px) {\n  .row .col.m1 {\n    width: 8.33333%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.m2 {\n    width: 16.66667%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.m3 {\n    width: 25%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.m4 {\n    width: 33.33333%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.m5 {\n    width: 41.66667%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.m6 {\n    width: 50%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.m7 {\n    width: 58.33333%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.m8 {\n    width: 66.66667%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.m9 {\n    width: 75%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.m10 {\n    width: 83.33333%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.m11 {\n    width: 91.66667%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.m12 {\n    width: 100%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.offset-m1 {\n    margin-left: 8.33333%;\n  }\n\n  .row .col.pull-m1 {\n    right: 8.33333%;\n  }\n\n  .row .col.push-m1 {\n    left: 8.33333%;\n  }\n\n  .row .col.offset-m2 {\n    margin-left: 16.66667%;\n  }\n\n  .row .col.pull-m2 {\n    right: 16.66667%;\n  }\n\n  .row .col.push-m2 {\n    left: 16.66667%;\n  }\n\n  .row .col.offset-m3 {\n    margin-left: 25%;\n  }\n\n  .row .col.pull-m3 {\n    right: 25%;\n  }\n\n  .row .col.push-m3 {\n    left: 25%;\n  }\n\n  .row .col.offset-m4 {\n    margin-left: 33.33333%;\n  }\n\n  .row .col.pull-m4 {\n    right: 33.33333%;\n  }\n\n  .row .col.push-m4 {\n    left: 33.33333%;\n  }\n\n  .row .col.offset-m5 {\n    margin-left: 41.66667%;\n  }\n\n  .row .col.pull-m5 {\n    right: 41.66667%;\n  }\n\n  .row .col.push-m5 {\n    left: 41.66667%;\n  }\n\n  .row .col.offset-m6 {\n    margin-left: 50%;\n  }\n\n  .row .col.pull-m6 {\n    right: 50%;\n  }\n\n  .row .col.push-m6 {\n    left: 50%;\n  }\n\n  .row .col.offset-m7 {\n    margin-left: 58.33333%;\n  }\n\n  .row .col.pull-m7 {\n    right: 58.33333%;\n  }\n\n  .row .col.push-m7 {\n    left: 58.33333%;\n  }\n\n  .row .col.offset-m8 {\n    margin-left: 66.66667%;\n  }\n\n  .row .col.pull-m8 {\n    right: 66.66667%;\n  }\n\n  .row .col.push-m8 {\n    left: 66.66667%;\n  }\n\n  .row .col.offset-m9 {\n    margin-left: 75%;\n  }\n\n  .row .col.pull-m9 {\n    right: 75%;\n  }\n\n  .row .col.push-m9 {\n    left: 75%;\n  }\n\n  .row .col.offset-m10 {\n    margin-left: 83.33333%;\n  }\n\n  .row .col.pull-m10 {\n    right: 83.33333%;\n  }\n\n  .row .col.push-m10 {\n    left: 83.33333%;\n  }\n\n  .row .col.offset-m11 {\n    margin-left: 91.66667%;\n  }\n\n  .row .col.pull-m11 {\n    right: 91.66667%;\n  }\n\n  .row .col.push-m11 {\n    left: 91.66667%;\n  }\n\n  .row .col.offset-m12 {\n    margin-left: 100%;\n  }\n\n  .row .col.pull-m12 {\n    right: 100%;\n  }\n\n  .row .col.push-m12 {\n    left: 100%;\n  }\n}\n\n@media only screen and (min-width: 993px) {\n  .row .col.l1 {\n    width: 8.33333%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.l2 {\n    width: 16.66667%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.l3 {\n    width: 25%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.l4 {\n    width: 33.33333%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.l5 {\n    width: 41.66667%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.l6 {\n    width: 50%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.l7 {\n    width: 58.33333%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.l8 {\n    width: 66.66667%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.l9 {\n    width: 75%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.l10 {\n    width: 83.33333%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.l11 {\n    width: 91.66667%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.l12 {\n    width: 100%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.offset-l1 {\n    margin-left: 8.33333%;\n  }\n\n  .row .col.pull-l1 {\n    right: 8.33333%;\n  }\n\n  .row .col.push-l1 {\n    left: 8.33333%;\n  }\n\n  .row .col.offset-l2 {\n    margin-left: 16.66667%;\n  }\n\n  .row .col.pull-l2 {\n    right: 16.66667%;\n  }\n\n  .row .col.push-l2 {\n    left: 16.66667%;\n  }\n\n  .row .col.offset-l3 {\n    margin-left: 25%;\n  }\n\n  .row .col.pull-l3 {\n    right: 25%;\n  }\n\n  .row .col.push-l3 {\n    left: 25%;\n  }\n\n  .row .col.offset-l4 {\n    margin-left: 33.33333%;\n  }\n\n  .row .col.pull-l4 {\n    right: 33.33333%;\n  }\n\n  .row .col.push-l4 {\n    left: 33.33333%;\n  }\n\n  .row .col.offset-l5 {\n    margin-left: 41.66667%;\n  }\n\n  .row .col.pull-l5 {\n    right: 41.66667%;\n  }\n\n  .row .col.push-l5 {\n    left: 41.66667%;\n  }\n\n  .row .col.offset-l6 {\n    margin-left: 50%;\n  }\n\n  .row .col.pull-l6 {\n    right: 50%;\n  }\n\n  .row .col.push-l6 {\n    left: 50%;\n  }\n\n  .row .col.offset-l7 {\n    margin-left: 58.33333%;\n  }\n\n  .row .col.pull-l7 {\n    right: 58.33333%;\n  }\n\n  .row .col.push-l7 {\n    left: 58.33333%;\n  }\n\n  .row .col.offset-l8 {\n    margin-left: 66.66667%;\n  }\n\n  .row .col.pull-l8 {\n    right: 66.66667%;\n  }\n\n  .row .col.push-l8 {\n    left: 66.66667%;\n  }\n\n  .row .col.offset-l9 {\n    margin-left: 75%;\n  }\n\n  .row .col.pull-l9 {\n    right: 75%;\n  }\n\n  .row .col.push-l9 {\n    left: 75%;\n  }\n\n  .row .col.offset-l10 {\n    margin-left: 83.33333%;\n  }\n\n  .row .col.pull-l10 {\n    right: 83.33333%;\n  }\n\n  .row .col.push-l10 {\n    left: 83.33333%;\n  }\n\n  .row .col.offset-l11 {\n    margin-left: 91.66667%;\n  }\n\n  .row .col.pull-l11 {\n    right: 91.66667%;\n  }\n\n  .row .col.push-l11 {\n    left: 91.66667%;\n  }\n\n  .row .col.offset-l12 {\n    margin-left: 100%;\n  }\n\n  .row .col.pull-l12 {\n    right: 100%;\n  }\n\n  .row .col.push-l12 {\n    left: 100%;\n  }\n}\n\n@media only screen and (min-width: 1201px) {\n  .row .col.xl1 {\n    width: 8.33333%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.xl2 {\n    width: 16.66667%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.xl3 {\n    width: 25%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.xl4 {\n    width: 33.33333%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.xl5 {\n    width: 41.66667%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.xl6 {\n    width: 50%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.xl7 {\n    width: 58.33333%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.xl8 {\n    width: 66.66667%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.xl9 {\n    width: 75%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.xl10 {\n    width: 83.33333%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.xl11 {\n    width: 91.66667%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.xl12 {\n    width: 100%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.offset-xl1 {\n    margin-left: 8.33333%;\n  }\n\n  .row .col.pull-xl1 {\n    right: 8.33333%;\n  }\n\n  .row .col.push-xl1 {\n    left: 8.33333%;\n  }\n\n  .row .col.offset-xl2 {\n    margin-left: 16.66667%;\n  }\n\n  .row .col.pull-xl2 {\n    right: 16.66667%;\n  }\n\n  .row .col.push-xl2 {\n    left: 16.66667%;\n  }\n\n  .row .col.offset-xl3 {\n    margin-left: 25%;\n  }\n\n  .row .col.pull-xl3 {\n    right: 25%;\n  }\n\n  .row .col.push-xl3 {\n    left: 25%;\n  }\n\n  .row .col.offset-xl4 {\n    margin-left: 33.33333%;\n  }\n\n  .row .col.pull-xl4 {\n    right: 33.33333%;\n  }\n\n  .row .col.push-xl4 {\n    left: 33.33333%;\n  }\n\n  .row .col.offset-xl5 {\n    margin-left: 41.66667%;\n  }\n\n  .row .col.pull-xl5 {\n    right: 41.66667%;\n  }\n\n  .row .col.push-xl5 {\n    left: 41.66667%;\n  }\n\n  .row .col.offset-xl6 {\n    margin-left: 50%;\n  }\n\n  .row .col.pull-xl6 {\n    right: 50%;\n  }\n\n  .row .col.push-xl6 {\n    left: 50%;\n  }\n\n  .row .col.offset-xl7 {\n    margin-left: 58.33333%;\n  }\n\n  .row .col.pull-xl7 {\n    right: 58.33333%;\n  }\n\n  .row .col.push-xl7 {\n    left: 58.33333%;\n  }\n\n  .row .col.offset-xl8 {\n    margin-left: 66.66667%;\n  }\n\n  .row .col.pull-xl8 {\n    right: 66.66667%;\n  }\n\n  .row .col.push-xl8 {\n    left: 66.66667%;\n  }\n\n  .row .col.offset-xl9 {\n    margin-left: 75%;\n  }\n\n  .row .col.pull-xl9 {\n    right: 75%;\n  }\n\n  .row .col.push-xl9 {\n    left: 75%;\n  }\n\n  .row .col.offset-xl10 {\n    margin-left: 83.33333%;\n  }\n\n  .row .col.pull-xl10 {\n    right: 83.33333%;\n  }\n\n  .row .col.push-xl10 {\n    left: 83.33333%;\n  }\n\n  .row .col.offset-xl11 {\n    margin-left: 91.66667%;\n  }\n\n  .row .col.pull-xl11 {\n    right: 91.66667%;\n  }\n\n  .row .col.push-xl11 {\n    left: 91.66667%;\n  }\n\n  .row .col.offset-xl12 {\n    margin-left: 100%;\n  }\n\n  .row .col.pull-xl12 {\n    right: 100%;\n  }\n\n  .row .col.push-xl12 {\n    left: 100%;\n  }\n}\n\nnav {\n  color: #fff;\n  background-color: #ee6e73;\n  width: 100%;\n  height: 56px;\n  line-height: 56px;\n}\n\nnav.nav-extended {\n  height: auto;\n}\n\nnav.nav-extended .nav-wrapper {\n  min-height: 56px;\n  height: auto;\n}\n\nnav.nav-extended .nav-content {\n  position: relative;\n  line-height: normal;\n}\n\nnav a {\n  color: #fff;\n}\n\nnav i,\nnav [class^=\"mdi-\"],\nnav [class*=\"mdi-\"],\nnav i.material-icons {\n  display: block;\n  font-size: 24px;\n  height: 56px;\n  line-height: 56px;\n}\n\nnav .nav-wrapper {\n  position: relative;\n  height: 100%;\n}\n\n@media only screen and (min-width: 993px) {\n  nav a.button-collapse {\n    display: none;\n  }\n}\n\nnav .button-collapse {\n  float: left;\n  position: relative;\n  z-index: 1;\n  height: 56px;\n  margin: 0 18px;\n}\n\nnav .button-collapse i {\n  height: 56px;\n  line-height: 56px;\n}\n\nnav .brand-logo {\n  position: absolute;\n  color: #fff;\n  display: inline-block;\n  font-size: 2.1rem;\n  padding: 0;\n}\n\nnav .brand-logo.center {\n  left: 50%;\n  -webkit-transform: translateX(-50%);\n       -o-transform: translateX(-50%);\n          transform: translateX(-50%);\n}\n\n@media only screen and (max-width: 992px) {\n  nav .brand-logo {\n    left: 50%;\n    -webkit-transform: translateX(-50%);\n         -o-transform: translateX(-50%);\n            transform: translateX(-50%);\n  }\n\n  nav .brand-logo.left,\n  nav .brand-logo.right {\n    padding: 0;\n    -webkit-transform: none;\n         -o-transform: none;\n            transform: none;\n  }\n\n  nav .brand-logo.left {\n    left: 0.5rem;\n  }\n\n  nav .brand-logo.right {\n    right: 0.5rem;\n    left: auto;\n  }\n}\n\nnav .brand-logo.right {\n  right: 0.5rem;\n  padding: 0;\n}\n\nnav .brand-logo i,\nnav .brand-logo [class^=\"mdi-\"],\nnav .brand-logo [class*=\"mdi-\"],\nnav .brand-logo i.material-icons {\n  float: left;\n  margin-right: 15px;\n}\n\nnav .nav-title {\n  display: inline-block;\n  font-size: 32px;\n  padding: 28px 0;\n}\n\nnav ul {\n  margin: 0;\n}\n\nnav ul li {\n  -webkit-transition: background-color .3s;\n  -o-transition: background-color .3s;\n  transition: background-color .3s;\n  float: left;\n  padding: 0;\n}\n\nnav ul li.active {\n  background-color: rgba(0, 0, 0, 0.1);\n}\n\nnav ul a {\n  -webkit-transition: background-color .3s;\n  -o-transition: background-color .3s;\n  transition: background-color .3s;\n  font-size: 1rem;\n  color: #fff;\n  display: block;\n  padding: 0 15px;\n  cursor: pointer;\n}\n\nnav ul a.btn,\nnav ul a.btn-large,\nnav ul a.btn-large,\nnav ul a.btn-flat,\nnav ul a.btn-floating {\n  margin-top: -2px;\n  margin-left: 15px;\n  margin-right: 15px;\n}\n\nnav ul a.btn > .material-icons,\nnav ul a.btn-large > .material-icons,\nnav ul a.btn-large > .material-icons,\nnav ul a.btn-flat > .material-icons,\nnav ul a.btn-floating > .material-icons {\n  height: inherit;\n  line-height: inherit;\n}\n\nnav ul a:hover {\n  background-color: rgba(0, 0, 0, 0.1);\n}\n\nnav ul.left {\n  float: left;\n}\n\nnav form {\n  height: 100%;\n}\n\nnav .input-field {\n  margin: 0;\n  height: 100%;\n}\n\nnav .input-field input {\n  height: 100%;\n  font-size: 1.2rem;\n  border: none;\n  padding-left: 2rem;\n}\n\nnav .input-field input:focus,\nnav .input-field input[type=text]:valid,\nnav .input-field input[type=password]:valid,\nnav .input-field input[type=email]:valid,\nnav .input-field input[type=url]:valid,\nnav .input-field input[type=date]:valid {\n  border: none;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n}\n\nnav .input-field label {\n  top: 0;\n  left: 0;\n}\n\nnav .input-field label i {\n  color: rgba(255, 255, 255, 0.7);\n  -webkit-transition: color .3s;\n  -o-transition: color .3s;\n  transition: color .3s;\n}\n\nnav .input-field label.active i {\n  color: #fff;\n}\n\n.navbar-fixed {\n  position: relative;\n  height: 56px;\n  z-index: 997;\n}\n\n.navbar-fixed nav {\n  position: fixed;\n}\n\n@media only screen and (min-width: 601px) {\n  nav.nav-extended .nav-wrapper {\n    min-height: 64px;\n  }\n\n  nav,\n  nav .nav-wrapper i,\n  nav a.button-collapse,\n  nav a.button-collapse i {\n    height: 64px;\n    line-height: 64px;\n  }\n\n  .navbar-fixed {\n    height: 64px;\n  }\n}\n\na {\n  text-decoration: none;\n}\n\nhtml {\n  line-height: 1.5;\n  font-family: \"Roboto\", sans-serif;\n  font-weight: normal;\n  color: rgba(0, 0, 0, 0.87);\n}\n\n@media only screen and (min-width: 0) {\n  html {\n    font-size: 14px;\n  }\n}\n\n@media only screen and (min-width: 992px) {\n  html {\n    font-size: 14.5px;\n  }\n}\n\n@media only screen and (min-width: 1200px) {\n  html {\n    font-size: 15px;\n  }\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-weight: 400;\n  line-height: 1.1;\n}\n\nh1 a,\nh2 a,\nh3 a,\nh4 a,\nh5 a,\nh6 a {\n  font-weight: inherit;\n}\n\nh1 {\n  font-size: 4.2rem;\n  line-height: 110%;\n  margin: 2.1rem 0 1.68rem 0;\n}\n\nh2 {\n  font-size: 3.56rem;\n  line-height: 110%;\n  margin: 1.78rem 0 1.424rem 0;\n}\n\nh3 {\n  font-size: 2.92rem;\n  line-height: 110%;\n  margin: 1.46rem 0 1.168rem 0;\n}\n\nh4 {\n  font-size: 2.28rem;\n  line-height: 110%;\n  margin: 1.14rem 0 0.912rem 0;\n}\n\nh5 {\n  font-size: 1.64rem;\n  line-height: 110%;\n  margin: 0.82rem 0 0.656rem 0;\n}\n\nh6 {\n  font-size: 1rem;\n  line-height: 110%;\n  margin: 0.5rem 0 0.4rem 0;\n}\n\nem {\n  font-style: italic;\n}\n\nstrong {\n  font-weight: 500;\n}\n\nsmall {\n  font-size: 75%;\n}\n\n.light,\n.page-footer .footer-copyright {\n  font-weight: 300;\n}\n\n.thin {\n  font-weight: 200;\n}\n\n.flow-text {\n  font-weight: 300;\n}\n\n@media only screen and (min-width: 360px) {\n  .flow-text {\n    font-size: 1.2rem;\n  }\n}\n\n@media only screen and (min-width: 390px) {\n  .flow-text {\n    font-size: 1.224rem;\n  }\n}\n\n@media only screen and (min-width: 420px) {\n  .flow-text {\n    font-size: 1.248rem;\n  }\n}\n\n@media only screen and (min-width: 450px) {\n  .flow-text {\n    font-size: 1.272rem;\n  }\n}\n\n@media only screen and (min-width: 480px) {\n  .flow-text {\n    font-size: 1.296rem;\n  }\n}\n\n@media only screen and (min-width: 510px) {\n  .flow-text {\n    font-size: 1.32rem;\n  }\n}\n\n@media only screen and (min-width: 540px) {\n  .flow-text {\n    font-size: 1.344rem;\n  }\n}\n\n@media only screen and (min-width: 570px) {\n  .flow-text {\n    font-size: 1.368rem;\n  }\n}\n\n@media only screen and (min-width: 600px) {\n  .flow-text {\n    font-size: 1.392rem;\n  }\n}\n\n@media only screen and (min-width: 630px) {\n  .flow-text {\n    font-size: 1.416rem;\n  }\n}\n\n@media only screen and (min-width: 660px) {\n  .flow-text {\n    font-size: 1.44rem;\n  }\n}\n\n@media only screen and (min-width: 690px) {\n  .flow-text {\n    font-size: 1.464rem;\n  }\n}\n\n@media only screen and (min-width: 720px) {\n  .flow-text {\n    font-size: 1.488rem;\n  }\n}\n\n@media only screen and (min-width: 750px) {\n  .flow-text {\n    font-size: 1.512rem;\n  }\n}\n\n@media only screen and (min-width: 780px) {\n  .flow-text {\n    font-size: 1.536rem;\n  }\n}\n\n@media only screen and (min-width: 810px) {\n  .flow-text {\n    font-size: 1.56rem;\n  }\n}\n\n@media only screen and (min-width: 840px) {\n  .flow-text {\n    font-size: 1.584rem;\n  }\n}\n\n@media only screen and (min-width: 870px) {\n  .flow-text {\n    font-size: 1.608rem;\n  }\n}\n\n@media only screen and (min-width: 900px) {\n  .flow-text {\n    font-size: 1.632rem;\n  }\n}\n\n@media only screen and (min-width: 930px) {\n  .flow-text {\n    font-size: 1.656rem;\n  }\n}\n\n@media only screen and (min-width: 960px) {\n  .flow-text {\n    font-size: 1.68rem;\n  }\n}\n\n@media only screen and (max-width: 360px) {\n  .flow-text {\n    font-size: 1.2rem;\n  }\n}\n\n.btn,\n.btn-large,\n.btn-flat {\n  border: none;\n  border-radius: 2px;\n  display: inline-block;\n  height: 36px;\n  line-height: 36px;\n  padding: 0 2rem;\n  text-transform: uppercase;\n  vertical-align: middle;\n  -webkit-tap-highlight-color: transparent;\n}\n\n.btn.disabled,\n.disabled.btn-large,\n.btn-floating.disabled,\n.btn-large.disabled,\n.btn-flat.disabled,\n.btn:disabled,\n.btn-large:disabled,\n.btn-floating:disabled,\n.btn-large:disabled,\n.btn-flat:disabled,\n.btn[disabled],\n.btn-large[disabled],\n.btn-floating[disabled],\n.btn-large[disabled],\n.btn-flat[disabled] {\n  pointer-events: none;\n  background-color: #DFDFDF !important;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #9F9F9F !important;\n  cursor: default;\n}\n\n.btn.disabled:hover,\n.disabled.btn-large:hover,\n.btn-floating.disabled:hover,\n.btn-large.disabled:hover,\n.btn-flat.disabled:hover,\n.btn:disabled:hover,\n.btn-large:disabled:hover,\n.btn-floating:disabled:hover,\n.btn-large:disabled:hover,\n.btn-flat:disabled:hover,\n.btn[disabled]:hover,\n.btn-large[disabled]:hover,\n.btn-floating[disabled]:hover,\n.btn-large[disabled]:hover,\n.btn-flat[disabled]:hover {\n  background-color: #DFDFDF !important;\n  color: #9F9F9F !important;\n}\n\n.btn,\n.btn-large,\n.btn-floating,\n.btn-large,\n.btn-flat {\n  font-size: 1rem;\n  outline: 0;\n}\n\n.btn i,\n.btn-large i,\n.btn-floating i,\n.btn-large i,\n.btn-flat i {\n  font-size: 1.3rem;\n  line-height: inherit;\n}\n\n.btn:focus,\n.btn-large:focus,\n.btn-floating:focus {\n  background-color: #1d7d74;\n}\n\n.btn,\n.btn-large {\n  text-decoration: none;\n  color: #fff;\n  background-color: #26a69a;\n  text-align: center;\n  letter-spacing: .5px;\n  -webkit-transition: .2s ease-out;\n  -o-transition: .2s ease-out;\n  transition: .2s ease-out;\n  cursor: pointer;\n}\n\n.btn:hover,\n.btn-large:hover {\n  background-color: #2bbbad;\n}\n\n.btn-floating {\n  display: inline-block;\n  color: #fff;\n  position: relative;\n  overflow: hidden;\n  z-index: 1;\n  width: 40px;\n  height: 40px;\n  line-height: 40px;\n  padding: 0;\n  background-color: #26a69a;\n  border-radius: 50%;\n  -webkit-transition: .3s;\n  -o-transition: .3s;\n  transition: .3s;\n  cursor: pointer;\n  vertical-align: middle;\n}\n\n.btn-floating:hover {\n  background-color: #26a69a;\n}\n\n.btn-floating:before {\n  border-radius: 0;\n}\n\n.btn-floating.btn-large {\n  width: 56px;\n  height: 56px;\n}\n\n.btn-floating.btn-large.halfway-fab {\n  bottom: -28px;\n}\n\n.btn-floating.btn-large i {\n  line-height: 56px;\n}\n\n.btn-floating.halfway-fab {\n  position: absolute;\n  right: 24px;\n  bottom: -20px;\n}\n\n.btn-floating.halfway-fab.left {\n  right: auto;\n  left: 24px;\n}\n\n.btn-floating i {\n  width: inherit;\n  display: inline-block;\n  text-align: center;\n  color: #fff;\n  font-size: 1.6rem;\n  line-height: 40px;\n}\n\nbutton.btn-floating {\n  border: none;\n}\n\n.fixed-action-btn {\n  position: fixed;\n  right: 23px;\n  bottom: 23px;\n  padding-top: 15px;\n  margin-bottom: 0;\n  z-index: 997;\n}\n\n.fixed-action-btn.active ul {\n  visibility: visible;\n}\n\n.fixed-action-btn.horizontal {\n  padding: 0 0 0 15px;\n}\n\n.fixed-action-btn.horizontal ul {\n  text-align: right;\n  right: 64px;\n  top: 50%;\n  -webkit-transform: translateY(-50%);\n       -o-transform: translateY(-50%);\n          transform: translateY(-50%);\n  height: 100%;\n  left: auto;\n  width: 500px;\n  /*width 100% only goes to width of button container */\n}\n\n.fixed-action-btn.horizontal ul li {\n  display: inline-block;\n  margin: 15px 15px 0 0;\n}\n\n.fixed-action-btn.toolbar {\n  padding: 0;\n  height: 56px;\n}\n\n.fixed-action-btn.toolbar.active > a i {\n  opacity: 0;\n}\n\n.fixed-action-btn.toolbar ul {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  top: 0;\n  bottom: 0;\n  z-index: 1;\n}\n\n.fixed-action-btn.toolbar ul li {\n  -webkit-box-flex: 1;\n      -ms-flex: 1;\n          flex: 1;\n  display: inline-block;\n  margin: 0;\n  height: 100%;\n  -webkit-transition: none;\n  -o-transition: none;\n  transition: none;\n}\n\n.fixed-action-btn.toolbar ul li a {\n  display: block;\n  overflow: hidden;\n  position: relative;\n  width: 100%;\n  height: 100%;\n  background-color: transparent;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #fff;\n  line-height: 56px;\n  z-index: 1;\n}\n\n.fixed-action-btn.toolbar ul li a i {\n  line-height: inherit;\n}\n\n.fixed-action-btn ul {\n  left: 0;\n  right: 0;\n  text-align: center;\n  position: absolute;\n  bottom: 64px;\n  margin: 0;\n  visibility: hidden;\n}\n\n.fixed-action-btn ul li {\n  margin-bottom: 15px;\n}\n\n.fixed-action-btn ul a.btn-floating {\n  opacity: 0;\n}\n\n.fixed-action-btn .fab-backdrop {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: -1;\n  width: 40px;\n  height: 40px;\n  background-color: #26a69a;\n  border-radius: 50%;\n  -webkit-transform: scale(0);\n       -o-transform: scale(0);\n          transform: scale(0);\n}\n\n.btn-flat {\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  background-color: transparent;\n  color: #343434;\n  cursor: pointer;\n  -webkit-transition: background-color .2s;\n  -o-transition: background-color .2s;\n  transition: background-color .2s;\n}\n\n.btn-flat:focus,\n.btn-flat:hover {\n  -webkit-box-shadow: none;\n          box-shadow: none;\n}\n\n.btn-flat:focus {\n  background-color: rgba(0, 0, 0, 0.1);\n}\n\n.btn-flat.disabled {\n  background-color: transparent !important;\n  color: #b3b3b3 !important;\n  cursor: default;\n}\n\n.btn-large {\n  height: 54px;\n  line-height: 54px;\n}\n\n.btn-large i {\n  font-size: 1.6rem;\n}\n\n.btn-block {\n  display: block;\n}\n\n.dropdown-content {\n  background-color: #fff;\n  margin: 0;\n  display: none;\n  min-width: 100px;\n  max-height: 650px;\n  overflow-y: auto;\n  opacity: 0;\n  position: absolute;\n  z-index: 999;\n  will-change: width, height;\n}\n\n.dropdown-content li {\n  clear: both;\n  color: rgba(0, 0, 0, 0.87);\n  cursor: pointer;\n  min-height: 50px;\n  line-height: 1.5rem;\n  width: 100%;\n  text-align: left;\n  text-transform: none;\n}\n\n.dropdown-content li:hover,\n.dropdown-content li.active,\n.dropdown-content li.selected {\n  background-color: #eee;\n}\n\n.dropdown-content li.active.selected {\n  background-color: #e1e1e1;\n}\n\n.dropdown-content li.divider {\n  min-height: 0;\n  height: 1px;\n}\n\n.dropdown-content li > a,\n.dropdown-content li > span {\n  font-size: 16px;\n  color: #26a69a;\n  display: block;\n  line-height: 22px;\n  padding: 14px 16px;\n}\n\n.dropdown-content li > span > label {\n  top: 1px;\n  left: 0;\n  height: 18px;\n}\n\n.dropdown-content li > a > i {\n  height: inherit;\n  line-height: inherit;\n  float: left;\n  margin: 0 24px 0 0;\n  width: 24px;\n}\n\n.input-field.col .dropdown-content [type=\"checkbox\"] + label {\n  top: 1px;\n  left: 0;\n  height: 18px;\n}\n\n.collapsible {\n  border-top: 1px solid #ddd;\n  border-right: 1px solid #ddd;\n  border-left: 1px solid #ddd;\n  margin: 0.5rem 0 1rem 0;\n}\n\n.collapsible-header {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  cursor: pointer;\n  -webkit-tap-highlight-color: transparent;\n  line-height: 1.5;\n  padding: 1rem;\n  background-color: #fff;\n  border-bottom: 1px solid #ddd;\n}\n\n.collapsible-header i {\n  width: 2rem;\n  font-size: 1.6rem;\n  display: inline-block;\n  text-align: center;\n  margin-right: 1rem;\n}\n\n.collapsible-body {\n  display: none;\n  border-bottom: 1px solid #ddd;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  padding: 2rem;\n}\n\n.side-nav .collapsible,\n.side-nav.fixed .collapsible {\n  border: none;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n}\n\n.side-nav .collapsible li,\n.side-nav.fixed .collapsible li {\n  padding: 0;\n}\n\n.side-nav .collapsible-header,\n.side-nav.fixed .collapsible-header {\n  background-color: transparent;\n  border: none;\n  line-height: inherit;\n  height: inherit;\n  padding: 0 16px;\n}\n\n.side-nav .collapsible-header:hover,\n.side-nav.fixed .collapsible-header:hover {\n  background-color: rgba(0, 0, 0, 0.05);\n}\n\n.side-nav .collapsible-header i,\n.side-nav.fixed .collapsible-header i {\n  line-height: inherit;\n}\n\n.side-nav .collapsible-body,\n.side-nav.fixed .collapsible-body {\n  border: 0;\n  background-color: #fff;\n}\n\n.side-nav .collapsible-body li a,\n.side-nav.fixed .collapsible-body li a {\n  padding: 0 23.5px 0 31px;\n}\n\n.collapsible.popout {\n  border: none;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n}\n\n.collapsible.popout > li {\n  -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n          box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n  margin: 0 24px;\n  -webkit-transition: margin 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n  -o-transition: margin 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n  transition: margin 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n}\n\n.collapsible.popout > li.active {\n  -webkit-box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15);\n          box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15);\n  margin: 16px 0;\n}\n\nselect:focus {\n  outline: 1px solid #c9f3ef;\n}\n\nbutton:focus {\n  outline: none;\n  background-color: #2ab7a9;\n}\n\nlabel {\n  font-size: 0.8rem;\n  color: #9e9e9e;\n}\n\n/* Text Inputs + Textarea\r\n   ========================================================================== */\n\n/* Style Placeholders */\n\n::-webkit-input-placeholder {\n  color: #d1d1d1;\n}\n\n:-ms-input-placeholder {\n  color: #d1d1d1;\n}\n\n::-ms-input-placeholder {\n  color: #d1d1d1;\n}\n\n::placeholder {\n  color: #d1d1d1;\n}\n\n/* Text inputs */\n\ninput:not([type]),\ninput[type=text]:not(.browser-default),\ninput[type=password]:not(.browser-default),\ninput[type=email]:not(.browser-default),\ninput[type=url]:not(.browser-default),\ninput[type=time]:not(.browser-default),\ninput[type=date]:not(.browser-default),\ninput[type=datetime]:not(.browser-default),\ninput[type=datetime-local]:not(.browser-default),\ninput[type=tel]:not(.browser-default),\ninput[type=number]:not(.browser-default),\ninput[type=search]:not(.browser-default),\ntextarea.materialize-textarea {\n  background-color: transparent;\n  border: none;\n  border-bottom: 1px solid #9e9e9e;\n  border-radius: 0;\n  outline: none;\n  height: 3rem;\n  width: 100%;\n  font-size: 1rem;\n  margin: 0 0 20px 0;\n  padding: 0;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  -webkit-box-sizing: content-box;\n          box-sizing: content-box;\n  -webkit-transition: all 0.3s;\n  -o-transition: all 0.3s;\n  transition: all 0.3s;\n}\n\ninput:not([type]):disabled,\ninput:not([type])[readonly=\"readonly\"],\ninput[type=text]:not(.browser-default):disabled,\ninput[type=text]:not(.browser-default)[readonly=\"readonly\"],\ninput[type=password]:not(.browser-default):disabled,\ninput[type=password]:not(.browser-default)[readonly=\"readonly\"],\ninput[type=email]:not(.browser-default):disabled,\ninput[type=email]:not(.browser-default)[readonly=\"readonly\"],\ninput[type=url]:not(.browser-default):disabled,\ninput[type=url]:not(.browser-default)[readonly=\"readonly\"],\ninput[type=time]:not(.browser-default):disabled,\ninput[type=time]:not(.browser-default)[readonly=\"readonly\"],\ninput[type=date]:not(.browser-default):disabled,\ninput[type=date]:not(.browser-default)[readonly=\"readonly\"],\ninput[type=datetime]:not(.browser-default):disabled,\ninput[type=datetime]:not(.browser-default)[readonly=\"readonly\"],\ninput[type=datetime-local]:not(.browser-default):disabled,\ninput[type=datetime-local]:not(.browser-default)[readonly=\"readonly\"],\ninput[type=tel]:not(.browser-default):disabled,\ninput[type=tel]:not(.browser-default)[readonly=\"readonly\"],\ninput[type=number]:not(.browser-default):disabled,\ninput[type=number]:not(.browser-default)[readonly=\"readonly\"],\ninput[type=search]:not(.browser-default):disabled,\ninput[type=search]:not(.browser-default)[readonly=\"readonly\"],\ntextarea.materialize-textarea:disabled,\ntextarea.materialize-textarea[readonly=\"readonly\"] {\n  color: rgba(0, 0, 0, 0.42);\n  border-bottom: 1px dotted rgba(0, 0, 0, 0.42);\n}\n\ninput:not([type]):disabled + label,\ninput:not([type])[readonly=\"readonly\"] + label,\ninput[type=text]:not(.browser-default):disabled + label,\ninput[type=text]:not(.browser-default)[readonly=\"readonly\"] + label,\ninput[type=password]:not(.browser-default):disabled + label,\ninput[type=password]:not(.browser-default)[readonly=\"readonly\"] + label,\ninput[type=email]:not(.browser-default):disabled + label,\ninput[type=email]:not(.browser-default)[readonly=\"readonly\"] + label,\ninput[type=url]:not(.browser-default):disabled + label,\ninput[type=url]:not(.browser-default)[readonly=\"readonly\"] + label,\ninput[type=time]:not(.browser-default):disabled + label,\ninput[type=time]:not(.browser-default)[readonly=\"readonly\"] + label,\ninput[type=date]:not(.browser-default):disabled + label,\ninput[type=date]:not(.browser-default)[readonly=\"readonly\"] + label,\ninput[type=datetime]:not(.browser-default):disabled + label,\ninput[type=datetime]:not(.browser-default)[readonly=\"readonly\"] + label,\ninput[type=datetime-local]:not(.browser-default):disabled + label,\ninput[type=datetime-local]:not(.browser-default)[readonly=\"readonly\"] + label,\ninput[type=tel]:not(.browser-default):disabled + label,\ninput[type=tel]:not(.browser-default)[readonly=\"readonly\"] + label,\ninput[type=number]:not(.browser-default):disabled + label,\ninput[type=number]:not(.browser-default)[readonly=\"readonly\"] + label,\ninput[type=search]:not(.browser-default):disabled + label,\ninput[type=search]:not(.browser-default)[readonly=\"readonly\"] + label,\ntextarea.materialize-textarea:disabled + label,\ntextarea.materialize-textarea[readonly=\"readonly\"] + label {\n  color: rgba(0, 0, 0, 0.42);\n}\n\ninput:not([type]):focus:not([readonly]),\ninput[type=text]:not(.browser-default):focus:not([readonly]),\ninput[type=password]:not(.browser-default):focus:not([readonly]),\ninput[type=email]:not(.browser-default):focus:not([readonly]),\ninput[type=url]:not(.browser-default):focus:not([readonly]),\ninput[type=time]:not(.browser-default):focus:not([readonly]),\ninput[type=date]:not(.browser-default):focus:not([readonly]),\ninput[type=datetime]:not(.browser-default):focus:not([readonly]),\ninput[type=datetime-local]:not(.browser-default):focus:not([readonly]),\ninput[type=tel]:not(.browser-default):focus:not([readonly]),\ninput[type=number]:not(.browser-default):focus:not([readonly]),\ninput[type=search]:not(.browser-default):focus:not([readonly]),\ntextarea.materialize-textarea:focus:not([readonly]) {\n  border-bottom: 1px solid #26a69a;\n  -webkit-box-shadow: 0 1px 0 0 #26a69a;\n          box-shadow: 0 1px 0 0 #26a69a;\n}\n\ninput:not([type]):focus:not([readonly]) + label,\ninput[type=text]:not(.browser-default):focus:not([readonly]) + label,\ninput[type=password]:not(.browser-default):focus:not([readonly]) + label,\ninput[type=email]:not(.browser-default):focus:not([readonly]) + label,\ninput[type=url]:not(.browser-default):focus:not([readonly]) + label,\ninput[type=time]:not(.browser-default):focus:not([readonly]) + label,\ninput[type=date]:not(.browser-default):focus:not([readonly]) + label,\ninput[type=datetime]:not(.browser-default):focus:not([readonly]) + label,\ninput[type=datetime-local]:not(.browser-default):focus:not([readonly]) + label,\ninput[type=tel]:not(.browser-default):focus:not([readonly]) + label,\ninput[type=number]:not(.browser-default):focus:not([readonly]) + label,\ninput[type=search]:not(.browser-default):focus:not([readonly]) + label,\ntextarea.materialize-textarea:focus:not([readonly]) + label {\n  color: #26a69a;\n}\n\ninput:not([type]).validate + label,\ninput[type=text]:not(.browser-default).validate + label,\ninput[type=password]:not(.browser-default).validate + label,\ninput[type=email]:not(.browser-default).validate + label,\ninput[type=url]:not(.browser-default).validate + label,\ninput[type=time]:not(.browser-default).validate + label,\ninput[type=date]:not(.browser-default).validate + label,\ninput[type=datetime]:not(.browser-default).validate + label,\ninput[type=datetime-local]:not(.browser-default).validate + label,\ninput[type=tel]:not(.browser-default).validate + label,\ninput[type=number]:not(.browser-default).validate + label,\ninput[type=search]:not(.browser-default).validate + label,\ntextarea.materialize-textarea.validate + label {\n  width: 100%;\n}\n\ninput:not([type]).invalid + label:after,\ninput:not([type]).valid + label:after,\ninput[type=text]:not(.browser-default).invalid + label:after,\ninput[type=text]:not(.browser-default).valid + label:after,\ninput[type=password]:not(.browser-default).invalid + label:after,\ninput[type=password]:not(.browser-default).valid + label:after,\ninput[type=email]:not(.browser-default).invalid + label:after,\ninput[type=email]:not(.browser-default).valid + label:after,\ninput[type=url]:not(.browser-default).invalid + label:after,\ninput[type=url]:not(.browser-default).valid + label:after,\ninput[type=time]:not(.browser-default).invalid + label:after,\ninput[type=time]:not(.browser-default).valid + label:after,\ninput[type=date]:not(.browser-default).invalid + label:after,\ninput[type=date]:not(.browser-default).valid + label:after,\ninput[type=datetime]:not(.browser-default).invalid + label:after,\ninput[type=datetime]:not(.browser-default).valid + label:after,\ninput[type=datetime-local]:not(.browser-default).invalid + label:after,\ninput[type=datetime-local]:not(.browser-default).valid + label:after,\ninput[type=tel]:not(.browser-default).invalid + label:after,\ninput[type=tel]:not(.browser-default).valid + label:after,\ninput[type=number]:not(.browser-default).invalid + label:after,\ninput[type=number]:not(.browser-default).valid + label:after,\ninput[type=search]:not(.browser-default).invalid + label:after,\ninput[type=search]:not(.browser-default).valid + label:after,\ntextarea.materialize-textarea.invalid + label:after,\ntextarea.materialize-textarea.valid + label:after {\n  display: none;\n}\n\ninput:not([type]).invalid + label.active:after,\ninput:not([type]).valid + label.active:after,\ninput[type=text]:not(.browser-default).invalid + label.active:after,\ninput[type=text]:not(.browser-default).valid + label.active:after,\ninput[type=password]:not(.browser-default).invalid + label.active:after,\ninput[type=password]:not(.browser-default).valid + label.active:after,\ninput[type=email]:not(.browser-default).invalid + label.active:after,\ninput[type=email]:not(.browser-default).valid + label.active:after,\ninput[type=url]:not(.browser-default).invalid + label.active:after,\ninput[type=url]:not(.browser-default).valid + label.active:after,\ninput[type=time]:not(.browser-default).invalid + label.active:after,\ninput[type=time]:not(.browser-default).valid + label.active:after,\ninput[type=date]:not(.browser-default).invalid + label.active:after,\ninput[type=date]:not(.browser-default).valid + label.active:after,\ninput[type=datetime]:not(.browser-default).invalid + label.active:after,\ninput[type=datetime]:not(.browser-default).valid + label.active:after,\ninput[type=datetime-local]:not(.browser-default).invalid + label.active:after,\ninput[type=datetime-local]:not(.browser-default).valid + label.active:after,\ninput[type=tel]:not(.browser-default).invalid + label.active:after,\ninput[type=tel]:not(.browser-default).valid + label.active:after,\ninput[type=number]:not(.browser-default).invalid + label.active:after,\ninput[type=number]:not(.browser-default).valid + label.active:after,\ninput[type=search]:not(.browser-default).invalid + label.active:after,\ninput[type=search]:not(.browser-default).valid + label.active:after,\ntextarea.materialize-textarea.invalid + label.active:after,\ntextarea.materialize-textarea.valid + label.active:after {\n  display: block;\n}\n\n/* Validation Sass Placeholders */\n\ninput.valid:not([type]),\ninput.valid:not([type]):focus,\ninput.valid[type=text]:not(.browser-default),\ninput.valid[type=text]:not(.browser-default):focus,\ninput.valid[type=password]:not(.browser-default),\ninput.valid[type=password]:not(.browser-default):focus,\ninput.valid[type=email]:not(.browser-default),\ninput.valid[type=email]:not(.browser-default):focus,\ninput.valid[type=url]:not(.browser-default),\ninput.valid[type=url]:not(.browser-default):focus,\ninput.valid[type=time]:not(.browser-default),\ninput.valid[type=time]:not(.browser-default):focus,\ninput.valid[type=date]:not(.browser-default),\ninput.valid[type=date]:not(.browser-default):focus,\ninput.valid[type=datetime]:not(.browser-default),\ninput.valid[type=datetime]:not(.browser-default):focus,\ninput.valid[type=datetime-local]:not(.browser-default),\ninput.valid[type=datetime-local]:not(.browser-default):focus,\ninput.valid[type=tel]:not(.browser-default),\ninput.valid[type=tel]:not(.browser-default):focus,\ninput.valid[type=number]:not(.browser-default),\ninput.valid[type=number]:not(.browser-default):focus,\ninput.valid[type=search]:not(.browser-default),\ninput.valid[type=search]:not(.browser-default):focus,\ntextarea.materialize-textarea.valid,\ntextarea.materialize-textarea.valid:focus,\n.select-wrapper.valid > input.select-dropdown {\n  border-bottom: 1px solid #4CAF50;\n  -webkit-box-shadow: 0 1px 0 0 #4CAF50;\n          box-shadow: 0 1px 0 0 #4CAF50;\n}\n\ninput.invalid:not([type]),\ninput.invalid:not([type]):focus,\ninput.invalid[type=text]:not(.browser-default),\ninput.invalid[type=text]:not(.browser-default):focus,\ninput.invalid[type=password]:not(.browser-default),\ninput.invalid[type=password]:not(.browser-default):focus,\ninput.invalid[type=email]:not(.browser-default),\ninput.invalid[type=email]:not(.browser-default):focus,\ninput.invalid[type=url]:not(.browser-default),\ninput.invalid[type=url]:not(.browser-default):focus,\ninput.invalid[type=time]:not(.browser-default),\ninput.invalid[type=time]:not(.browser-default):focus,\ninput.invalid[type=date]:not(.browser-default),\ninput.invalid[type=date]:not(.browser-default):focus,\ninput.invalid[type=datetime]:not(.browser-default),\ninput.invalid[type=datetime]:not(.browser-default):focus,\ninput.invalid[type=datetime-local]:not(.browser-default),\ninput.invalid[type=datetime-local]:not(.browser-default):focus,\ninput.invalid[type=tel]:not(.browser-default),\ninput.invalid[type=tel]:not(.browser-default):focus,\ninput.invalid[type=number]:not(.browser-default),\ninput.invalid[type=number]:not(.browser-default):focus,\ninput.invalid[type=search]:not(.browser-default),\ninput.invalid[type=search]:not(.browser-default):focus,\ntextarea.materialize-textarea.invalid,\ntextarea.materialize-textarea.invalid:focus,\n.select-wrapper.invalid > input.select-dropdown {\n  border-bottom: 1px solid #F44336;\n  -webkit-box-shadow: 0 1px 0 0 #F44336;\n          box-shadow: 0 1px 0 0 #F44336;\n}\n\ninput:not([type]).valid + label:after,\ninput:not([type]):focus.valid + label:after,\ninput[type=text]:not(.browser-default).valid + label:after,\ninput[type=text]:not(.browser-default):focus.valid + label:after,\ninput[type=password]:not(.browser-default).valid + label:after,\ninput[type=password]:not(.browser-default):focus.valid + label:after,\ninput[type=email]:not(.browser-default).valid + label:after,\ninput[type=email]:not(.browser-default):focus.valid + label:after,\ninput[type=url]:not(.browser-default).valid + label:after,\ninput[type=url]:not(.browser-default):focus.valid + label:after,\ninput[type=time]:not(.browser-default).valid + label:after,\ninput[type=time]:not(.browser-default):focus.valid + label:after,\ninput[type=date]:not(.browser-default).valid + label:after,\ninput[type=date]:not(.browser-default):focus.valid + label:after,\ninput[type=datetime]:not(.browser-default).valid + label:after,\ninput[type=datetime]:not(.browser-default):focus.valid + label:after,\ninput[type=datetime-local]:not(.browser-default).valid + label:after,\ninput[type=datetime-local]:not(.browser-default):focus.valid + label:after,\ninput[type=tel]:not(.browser-default).valid + label:after,\ninput[type=tel]:not(.browser-default):focus.valid + label:after,\ninput[type=number]:not(.browser-default).valid + label:after,\ninput[type=number]:not(.browser-default):focus.valid + label:after,\ninput[type=search]:not(.browser-default).valid + label:after,\ninput[type=search]:not(.browser-default):focus.valid + label:after,\ntextarea.materialize-textarea.valid + label:after,\ntextarea.materialize-textarea:focus.valid + label:after,\n.select-wrapper.valid + label:after {\n  content: attr(data-success);\n  color: #4CAF50;\n  opacity: 1;\n  -webkit-transform: translateY(9px);\n       -o-transform: translateY(9px);\n          transform: translateY(9px);\n}\n\ninput:not([type]).invalid + label:after,\ninput:not([type]):focus.invalid + label:after,\ninput[type=text]:not(.browser-default).invalid + label:after,\ninput[type=text]:not(.browser-default):focus.invalid + label:after,\ninput[type=password]:not(.browser-default).invalid + label:after,\ninput[type=password]:not(.browser-default):focus.invalid + label:after,\ninput[type=email]:not(.browser-default).invalid + label:after,\ninput[type=email]:not(.browser-default):focus.invalid + label:after,\ninput[type=url]:not(.browser-default).invalid + label:after,\ninput[type=url]:not(.browser-default):focus.invalid + label:after,\ninput[type=time]:not(.browser-default).invalid + label:after,\ninput[type=time]:not(.browser-default):focus.invalid + label:after,\ninput[type=date]:not(.browser-default).invalid + label:after,\ninput[type=date]:not(.browser-default):focus.invalid + label:after,\ninput[type=datetime]:not(.browser-default).invalid + label:after,\ninput[type=datetime]:not(.browser-default):focus.invalid + label:after,\ninput[type=datetime-local]:not(.browser-default).invalid + label:after,\ninput[type=datetime-local]:not(.browser-default):focus.invalid + label:after,\ninput[type=tel]:not(.browser-default).invalid + label:after,\ninput[type=tel]:not(.browser-default):focus.invalid + label:after,\ninput[type=number]:not(.browser-default).invalid + label:after,\ninput[type=number]:not(.browser-default):focus.invalid + label:after,\ninput[type=search]:not(.browser-default).invalid + label:after,\ninput[type=search]:not(.browser-default):focus.invalid + label:after,\ntextarea.materialize-textarea.invalid + label:after,\ntextarea.materialize-textarea:focus.invalid + label:after,\n.select-wrapper.invalid + label:after {\n  content: attr(data-error);\n  color: #F44336;\n  opacity: 1;\n  -webkit-transform: translateY(9px);\n       -o-transform: translateY(9px);\n          transform: translateY(9px);\n}\n\ninput:not([type]) + label:after,\ninput[type=text]:not(.browser-default) + label:after,\ninput[type=password]:not(.browser-default) + label:after,\ninput[type=email]:not(.browser-default) + label:after,\ninput[type=url]:not(.browser-default) + label:after,\ninput[type=time]:not(.browser-default) + label:after,\ninput[type=date]:not(.browser-default) + label:after,\ninput[type=datetime]:not(.browser-default) + label:after,\ninput[type=datetime-local]:not(.browser-default) + label:after,\ninput[type=tel]:not(.browser-default) + label:after,\ninput[type=number]:not(.browser-default) + label:after,\ninput[type=search]:not(.browser-default) + label:after,\ntextarea.materialize-textarea + label:after,\n.select-wrapper + label:after {\n  display: block;\n  content: \"\";\n  position: absolute;\n  top: 100%;\n  left: 0;\n  opacity: 0;\n  -webkit-transition: .2s opacity ease-out, .2s color ease-out;\n  -o-transition: .2s opacity ease-out, .2s color ease-out;\n  transition: .2s opacity ease-out, .2s color ease-out;\n}\n\n.input-field {\n  position: relative;\n  margin-top: 1rem;\n}\n\n.input-field.inline {\n  display: inline-block;\n  vertical-align: middle;\n  margin-left: 5px;\n}\n\n.input-field.inline input,\n.input-field.inline .select-dropdown {\n  margin-bottom: 1rem;\n}\n\n.input-field.col label {\n  left: 0.75rem;\n}\n\n.input-field.col .prefix ~ label,\n.input-field.col .prefix ~ .validate ~ label {\n  width: calc(100% - 3rem - 1.5rem);\n}\n\n.input-field label {\n  color: #9e9e9e;\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  font-size: 1rem;\n  cursor: text;\n  -webkit-transition: -webkit-transform .2s ease-out;\n  transition: -webkit-transform .2s ease-out;\n  -o-transition: -o-transform .2s ease-out;\n  transition: transform .2s ease-out;\n  transition: transform .2s ease-out, -webkit-transform .2s ease-out, -o-transform .2s ease-out;\n  -webkit-transform-origin: 0% 100%;\n       -o-transform-origin: 0% 100%;\n          transform-origin: 0% 100%;\n  text-align: initial;\n  -webkit-transform: translateY(12px);\n       -o-transform: translateY(12px);\n          transform: translateY(12px);\n  pointer-events: none;\n}\n\n.input-field label:not(.label-icon).active {\n  -webkit-transform: translateY(-14px) scale(0.8);\n       -o-transform: translateY(-14px) scale(0.8);\n          transform: translateY(-14px) scale(0.8);\n  -webkit-transform-origin: 0 0;\n       -o-transform-origin: 0 0;\n          transform-origin: 0 0;\n}\n\n.input-field .prefix {\n  position: absolute;\n  width: 3rem;\n  font-size: 2rem;\n  -webkit-transition: color .2s;\n  -o-transition: color .2s;\n  transition: color .2s;\n}\n\n.input-field .prefix.active {\n  color: #26a69a;\n}\n\n.input-field .prefix ~ input,\n.input-field .prefix ~ textarea,\n.input-field .prefix ~ label,\n.input-field .prefix ~ .validate ~ label,\n.input-field .prefix ~ .autocomplete-content {\n  margin-left: 3rem;\n  width: 92%;\n  width: calc(100% - 3rem);\n}\n\n.input-field .prefix ~ label {\n  margin-left: 3rem;\n}\n\n@media only screen and (max-width: 992px) {\n  .input-field .prefix ~ input {\n    width: 86%;\n    width: calc(100% - 3rem);\n  }\n}\n\n@media only screen and (max-width: 600px) {\n  .input-field .prefix ~ input {\n    width: 80%;\n    width: calc(100% - 3rem);\n  }\n}\n\n/* Search Field */\n\n.input-field input[type=search] {\n  display: block;\n  line-height: inherit;\n}\n\n.nav-wrapper .input-field input[type=search] {\n  height: inherit;\n  padding-left: 4rem;\n  width: calc(100% - 4rem);\n  border: 0;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n}\n\n.input-field input[type=search]:focus {\n  background-color: #fff;\n  border: 0;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  color: #444;\n}\n\n.input-field input[type=search]:focus + label i,\n.input-field input[type=search]:focus ~ .mdi-navigation-close,\n.input-field input[type=search]:focus ~ .material-icons {\n  color: #444;\n}\n\n.input-field input[type=search] + label {\n  left: 1rem;\n}\n\n.input-field input[type=search] ~ .mdi-navigation-close,\n.input-field input[type=search] ~ .material-icons {\n  position: absolute;\n  top: 0;\n  right: 1rem;\n  color: transparent;\n  cursor: pointer;\n  font-size: 2rem;\n  -webkit-transition: .3s color;\n  -o-transition: .3s color;\n  transition: .3s color;\n}\n\n/* Textarea */\n\ntextarea {\n  width: 100%;\n  height: 3rem;\n  background-color: transparent;\n}\n\ntextarea.materialize-textarea {\n  overflow-y: hidden;\n  /* prevents scroll bar flash */\n  padding: .8rem 0 1.6rem 0;\n  /* prevents text jump on Enter keypress */\n  resize: none;\n  min-height: 3rem;\n}\n\ntextarea.materialize-textarea.validate + label {\n  height: 100%;\n}\n\ntextarea.materialize-textarea.validate + label::after {\n  top: calc(100% - 12px);\n}\n\ntextarea.materialize-textarea.validate + label:not(.label-icon).active {\n  -webkit-transform: translateY(-25px);\n       -o-transform: translateY(-25px);\n          transform: translateY(-25px);\n}\n\n.hiddendiv {\n  display: none;\n  white-space: pre-wrap;\n  word-wrap: break-word;\n  overflow-wrap: break-word;\n  /* future version of deprecated 'word-wrap' */\n  padding-top: 1.2rem;\n  /* prevents text jump on Enter keypress */\n  position: absolute;\n  top: 0;\n}\n\n/* Autocomplete */\n\n.autocomplete-content {\n  margin-top: -20px;\n  margin-bottom: 20px;\n  display: block;\n  opacity: 1;\n  position: static;\n}\n\n.autocomplete-content li .highlight {\n  color: #444;\n}\n\n.autocomplete-content li img {\n  height: 40px;\n  width: 40px;\n  margin: 5px 15px;\n}\n\n/* Radio Buttons\r\n   ========================================================================== */\n\n[type=\"radio\"]:not(:checked),\n[type=\"radio\"]:checked {\n  position: absolute;\n  opacity: 0;\n  pointer-events: none;\n}\n\n[type=\"radio\"]:not(:checked) + label,\n[type=\"radio\"]:checked + label {\n  position: relative;\n  padding-left: 35px;\n  cursor: pointer;\n  display: inline-block;\n  height: 25px;\n  line-height: 25px;\n  font-size: 1rem;\n  -webkit-transition: .28s ease;\n  -o-transition: .28s ease;\n  transition: .28s ease;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n\n[type=\"radio\"] + label:before,\n[type=\"radio\"] + label:after {\n  content: '';\n  position: absolute;\n  left: 0;\n  top: 0;\n  margin: 4px;\n  width: 16px;\n  height: 16px;\n  z-index: 0;\n  -webkit-transition: .28s ease;\n  -o-transition: .28s ease;\n  transition: .28s ease;\n}\n\n/* Unchecked styles */\n\n[type=\"radio\"]:not(:checked) + label:before,\n[type=\"radio\"]:not(:checked) + label:after,\n[type=\"radio\"]:checked + label:before,\n[type=\"radio\"]:checked + label:after,\n[type=\"radio\"].with-gap:checked + label:before,\n[type=\"radio\"].with-gap:checked + label:after {\n  border-radius: 50%;\n}\n\n[type=\"radio\"]:not(:checked) + label:before,\n[type=\"radio\"]:not(:checked) + label:after {\n  border: 2px solid #5a5a5a;\n}\n\n[type=\"radio\"]:not(:checked) + label:after {\n  -webkit-transform: scale(0);\n       -o-transform: scale(0);\n          transform: scale(0);\n}\n\n/* Checked styles */\n\n[type=\"radio\"]:checked + label:before {\n  border: 2px solid transparent;\n}\n\n[type=\"radio\"]:checked + label:after,\n[type=\"radio\"].with-gap:checked + label:before,\n[type=\"radio\"].with-gap:checked + label:after {\n  border: 2px solid #26a69a;\n}\n\n[type=\"radio\"]:checked + label:after,\n[type=\"radio\"].with-gap:checked + label:after {\n  background-color: #26a69a;\n}\n\n[type=\"radio\"]:checked + label:after {\n  -webkit-transform: scale(1.02);\n       -o-transform: scale(1.02);\n          transform: scale(1.02);\n}\n\n/* Radio With gap */\n\n[type=\"radio\"].with-gap:checked + label:after {\n  -webkit-transform: scale(0.5);\n       -o-transform: scale(0.5);\n          transform: scale(0.5);\n}\n\n/* Focused styles */\n\n[type=\"radio\"].tabbed:focus + label:before {\n  -webkit-box-shadow: 0 0 0 10px rgba(0, 0, 0, 0.1);\n          box-shadow: 0 0 0 10px rgba(0, 0, 0, 0.1);\n}\n\n/* Disabled Radio With gap */\n\n[type=\"radio\"].with-gap:disabled:checked + label:before {\n  border: 2px solid rgba(0, 0, 0, 0.42);\n}\n\n[type=\"radio\"].with-gap:disabled:checked + label:after {\n  border: none;\n  background-color: rgba(0, 0, 0, 0.42);\n}\n\n/* Disabled style */\n\n[type=\"radio\"]:disabled:not(:checked) + label:before,\n[type=\"radio\"]:disabled:checked + label:before {\n  background-color: transparent;\n  border-color: rgba(0, 0, 0, 0.42);\n}\n\n[type=\"radio\"]:disabled + label {\n  color: rgba(0, 0, 0, 0.42);\n}\n\n[type=\"radio\"]:disabled:not(:checked) + label:before {\n  border-color: rgba(0, 0, 0, 0.42);\n}\n\n[type=\"radio\"]:disabled:checked + label:after {\n  background-color: rgba(0, 0, 0, 0.42);\n  border-color: #949494;\n}\n\n/* Checkboxes\r\n   ========================================================================== */\n\n/* CUSTOM CSS CHECKBOXES */\n\nform p {\n  margin-bottom: 10px;\n  text-align: left;\n}\n\nform p:last-child {\n  margin-bottom: 0;\n}\n\n/* Remove default checkbox */\n\n[type=\"checkbox\"]:not(:checked),\n[type=\"checkbox\"]:checked {\n  position: absolute;\n  opacity: 0;\n  pointer-events: none;\n}\n\n[type=\"checkbox\"] {\n  /* checkbox aspect */\n}\n\n[type=\"checkbox\"] + label {\n  position: relative;\n  padding-left: 35px;\n  cursor: pointer;\n  display: inline-block;\n  height: 25px;\n  line-height: 25px;\n  font-size: 1rem;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n\n[type=\"checkbox\"] + label:before,\n[type=\"checkbox\"]:not(.filled-in) + label:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 18px;\n  height: 18px;\n  z-index: 0;\n  border: 2px solid #5a5a5a;\n  border-radius: 1px;\n  margin-top: 2px;\n  -webkit-transition: .2s;\n  -o-transition: .2s;\n  transition: .2s;\n}\n\n[type=\"checkbox\"]:not(.filled-in) + label:after {\n  border: 0;\n  -webkit-transform: scale(0);\n       -o-transform: scale(0);\n          transform: scale(0);\n}\n\n[type=\"checkbox\"]:not(:checked):disabled + label:before {\n  border: none;\n  background-color: rgba(0, 0, 0, 0.42);\n}\n\n[type=\"checkbox\"].tabbed:focus + label:after {\n  -webkit-transform: scale(1);\n       -o-transform: scale(1);\n          transform: scale(1);\n  border: 0;\n  border-radius: 50%;\n  -webkit-box-shadow: 0 0 0 10px rgba(0, 0, 0, 0.1);\n          box-shadow: 0 0 0 10px rgba(0, 0, 0, 0.1);\n  background-color: rgba(0, 0, 0, 0.1);\n}\n\n[type=\"checkbox\"]:checked + label:before {\n  top: -4px;\n  left: -5px;\n  width: 12px;\n  height: 22px;\n  border-top: 2px solid transparent;\n  border-left: 2px solid transparent;\n  border-right: 2px solid #26a69a;\n  border-bottom: 2px solid #26a69a;\n  -webkit-transform: rotate(40deg);\n       -o-transform: rotate(40deg);\n          transform: rotate(40deg);\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden;\n  -webkit-transform-origin: 100% 100%;\n       -o-transform-origin: 100% 100%;\n          transform-origin: 100% 100%;\n}\n\n[type=\"checkbox\"]:checked:disabled + label:before {\n  border-right: 2px solid rgba(0, 0, 0, 0.42);\n  border-bottom: 2px solid rgba(0, 0, 0, 0.42);\n}\n\n/* Indeterminate checkbox */\n\n[type=\"checkbox\"]:indeterminate + label:before {\n  top: -11px;\n  left: -12px;\n  width: 10px;\n  height: 22px;\n  border-top: none;\n  border-left: none;\n  border-right: 2px solid #26a69a;\n  border-bottom: none;\n  -webkit-transform: rotate(90deg);\n       -o-transform: rotate(90deg);\n          transform: rotate(90deg);\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden;\n  -webkit-transform-origin: 100% 100%;\n       -o-transform-origin: 100% 100%;\n          transform-origin: 100% 100%;\n}\n\n[type=\"checkbox\"]:indeterminate:disabled + label:before {\n  border-right: 2px solid rgba(0, 0, 0, 0.42);\n  background-color: transparent;\n}\n\n[type=\"checkbox\"].filled-in + label:after {\n  border-radius: 2px;\n}\n\n[type=\"checkbox\"].filled-in + label:before,\n[type=\"checkbox\"].filled-in + label:after {\n  content: '';\n  left: 0;\n  position: absolute;\n  /* .1s delay is for check animation */\n  -webkit-transition: border .25s, background-color .25s, width .20s .1s, height .20s .1s, top .20s .1s, left .20s .1s;\n  -o-transition: border .25s, background-color .25s, width .20s .1s, height .20s .1s, top .20s .1s, left .20s .1s;\n  transition: border .25s, background-color .25s, width .20s .1s, height .20s .1s, top .20s .1s, left .20s .1s;\n  z-index: 1;\n}\n\n[type=\"checkbox\"].filled-in:not(:checked) + label:before {\n  width: 0;\n  height: 0;\n  border: 3px solid transparent;\n  left: 6px;\n  top: 10px;\n  -webkit-transform: rotateZ(37deg);\n       -o-transform: rotateZ(37deg);\n          transform: rotateZ(37deg);\n  -webkit-transform-origin: 100% 100%;\n       -o-transform-origin: 100% 100%;\n          transform-origin: 100% 100%;\n}\n\n[type=\"checkbox\"].filled-in:not(:checked) + label:after {\n  height: 20px;\n  width: 20px;\n  background-color: transparent;\n  border: 2px solid #5a5a5a;\n  top: 0px;\n  z-index: 0;\n}\n\n[type=\"checkbox\"].filled-in:checked + label:before {\n  top: 0;\n  left: 1px;\n  width: 8px;\n  height: 13px;\n  border-top: 2px solid transparent;\n  border-left: 2px solid transparent;\n  border-right: 2px solid #fff;\n  border-bottom: 2px solid #fff;\n  -webkit-transform: rotateZ(37deg);\n       -o-transform: rotateZ(37deg);\n          transform: rotateZ(37deg);\n  -webkit-transform-origin: 100% 100%;\n       -o-transform-origin: 100% 100%;\n          transform-origin: 100% 100%;\n}\n\n[type=\"checkbox\"].filled-in:checked + label:after {\n  top: 0;\n  width: 20px;\n  height: 20px;\n  border: 2px solid #26a69a;\n  background-color: #26a69a;\n  z-index: 0;\n}\n\n[type=\"checkbox\"].filled-in.tabbed:focus + label:after {\n  border-radius: 2px;\n  border-color: #5a5a5a;\n  background-color: rgba(0, 0, 0, 0.1);\n}\n\n[type=\"checkbox\"].filled-in.tabbed:checked:focus + label:after {\n  border-radius: 2px;\n  background-color: #26a69a;\n  border-color: #26a69a;\n}\n\n[type=\"checkbox\"].filled-in:disabled:not(:checked) + label:before {\n  background-color: transparent;\n  border: 2px solid transparent;\n}\n\n[type=\"checkbox\"].filled-in:disabled:not(:checked) + label:after {\n  border-color: transparent;\n  background-color: #949494;\n}\n\n[type=\"checkbox\"].filled-in:disabled:checked + label:before {\n  background-color: transparent;\n}\n\n[type=\"checkbox\"].filled-in:disabled:checked + label:after {\n  background-color: #949494;\n  border-color: #949494;\n}\n\n/* Switch\r\n   ========================================================================== */\n\n.switch,\n.switch * {\n  -webkit-tap-highlight-color: transparent;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n\n.switch label {\n  cursor: pointer;\n}\n\n.switch label input[type=checkbox] {\n  opacity: 0;\n  width: 0;\n  height: 0;\n}\n\n.switch label input[type=checkbox]:checked + .lever {\n  background-color: #84c7c1;\n}\n\n.switch label input[type=checkbox]:checked + .lever:before,\n.switch label input[type=checkbox]:checked + .lever:after {\n  left: 18px;\n}\n\n.switch label input[type=checkbox]:checked + .lever:after {\n  background-color: #26a69a;\n}\n\n.switch label .lever {\n  content: \"\";\n  display: inline-block;\n  position: relative;\n  width: 36px;\n  height: 14px;\n  background-color: rgba(0, 0, 0, 0.38);\n  border-radius: 15px;\n  margin-right: 10px;\n  -webkit-transition: background 0.3s ease;\n  -o-transition: background 0.3s ease;\n  transition: background 0.3s ease;\n  vertical-align: middle;\n  margin: 0 16px;\n}\n\n.switch label .lever:before,\n.switch label .lever:after {\n  content: \"\";\n  position: absolute;\n  display: inline-block;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  left: 0;\n  top: -3px;\n  -webkit-transition: left 0.3s ease, background .3s ease, -webkit-box-shadow 0.1s ease, -webkit-transform .1s ease;\n  transition: left 0.3s ease, background .3s ease, -webkit-box-shadow 0.1s ease, -webkit-transform .1s ease;\n  -o-transition: left 0.3s ease, background .3s ease, box-shadow 0.1s ease, -o-transform .1s ease;\n  transition: left 0.3s ease, background .3s ease, box-shadow 0.1s ease, transform .1s ease;\n  transition: left 0.3s ease, background .3s ease, box-shadow 0.1s ease, transform .1s ease, -webkit-box-shadow 0.1s ease, -webkit-transform .1s ease, -o-transform .1s ease;\n}\n\n.switch label .lever:before {\n  background-color: rgba(38, 166, 154, 0.15);\n}\n\n.switch label .lever:after {\n  background-color: #F1F1F1;\n  -webkit-box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\n          box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\n}\n\ninput[type=checkbox]:checked:not(:disabled) ~ .lever:active::before,\ninput[type=checkbox]:checked:not(:disabled).tabbed:focus ~ .lever::before {\n  -webkit-transform: scale(2.4);\n       -o-transform: scale(2.4);\n          transform: scale(2.4);\n  background-color: rgba(38, 166, 154, 0.15);\n}\n\ninput[type=checkbox]:not(:disabled) ~ .lever:active:before,\ninput[type=checkbox]:not(:disabled).tabbed:focus ~ .lever::before {\n  -webkit-transform: scale(2.4);\n       -o-transform: scale(2.4);\n          transform: scale(2.4);\n  background-color: rgba(0, 0, 0, 0.08);\n}\n\n.switch input[type=checkbox][disabled] + .lever {\n  cursor: default;\n  background-color: rgba(0, 0, 0, 0.12);\n}\n\n.switch label input[type=checkbox][disabled] + .lever:after,\n.switch label input[type=checkbox][disabled]:checked + .lever:after {\n  background-color: #949494;\n}\n\n/* Select Field\r\n   ========================================================================== */\n\nselect {\n  display: none;\n}\n\nselect.browser-default {\n  display: block;\n}\n\nselect {\n  background-color: rgba(255, 255, 255, 0.9);\n  width: 100%;\n  padding: 5px;\n  border: 1px solid #f2f2f2;\n  border-radius: 2px;\n  height: 3rem;\n}\n\n.input-field > select {\n  display: block;\n  position: absolute;\n  width: 0;\n  pointer-events: none;\n  height: 0;\n  top: 0;\n  left: 0;\n  opacity: 0;\n}\n\n.select-label {\n  position: absolute;\n}\n\n.select-wrapper {\n  position: relative;\n}\n\n.select-wrapper.valid + label,\n.select-wrapper.invalid + label {\n  width: 100%;\n  pointer-events: none;\n}\n\n.select-wrapper input.select-dropdown {\n  position: relative;\n  cursor: pointer;\n  background-color: transparent;\n  border: none;\n  border-bottom: 1px solid #9e9e9e;\n  outline: none;\n  height: 3rem;\n  line-height: 3rem;\n  width: 100%;\n  font-size: 1rem;\n  margin: 0 0 20px 0;\n  padding: 0;\n  display: block;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n\n.select-wrapper span.caret {\n  color: initial;\n  position: absolute;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  height: 10px;\n  margin: auto 0;\n  font-size: 10px;\n  line-height: 10px;\n}\n\n.select-wrapper + label {\n  position: absolute;\n  top: -26px;\n  font-size: 0.8rem;\n}\n\nselect:disabled {\n  color: rgba(0, 0, 0, 0.42);\n}\n\n.select-wrapper.disabled span.caret,\n.select-wrapper.disabled + label {\n  color: rgba(0, 0, 0, 0.42);\n}\n\n.select-wrapper input.select-dropdown:disabled {\n  color: rgba(0, 0, 0, 0.42);\n  cursor: default;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n\n.select-wrapper i {\n  color: rgba(0, 0, 0, 0.3);\n}\n\n.select-dropdown li.disabled,\n.select-dropdown li.disabled > span,\n.select-dropdown li.optgroup {\n  color: rgba(0, 0, 0, 0.3);\n  background-color: transparent;\n}\n\n.select-dropdown.dropdown-content li.active {\n  background-color: transparent;\n}\n\n.select-dropdown.dropdown-content li:hover {\n  background-color: rgba(0, 0, 0, 0.06);\n}\n\n.select-dropdown.dropdown-content li.selected {\n  background-color: rgba(0, 0, 0, 0.03);\n}\n\n.prefix ~ .select-wrapper {\n  margin-left: 3rem;\n  width: 92%;\n  width: calc(100% - 3rem);\n}\n\n.prefix ~ label {\n  margin-left: 3rem;\n}\n\n.select-dropdown li img {\n  height: 40px;\n  width: 40px;\n  margin: 5px 15px;\n  float: right;\n}\n\n.select-dropdown li.optgroup {\n  border-top: 1px solid #eee;\n}\n\n.select-dropdown li.optgroup.selected > span {\n  color: rgba(0, 0, 0, 0.7);\n}\n\n.select-dropdown li.optgroup > span {\n  color: rgba(0, 0, 0, 0.4);\n}\n\n.select-dropdown li.optgroup ~ li.optgroup-option {\n  padding-left: 1rem;\n}\n\n/* File Input\r\n   ========================================================================== */\n\n.file-field {\n  position: relative;\n}\n\n.file-field .file-path-wrapper {\n  overflow: hidden;\n  padding-left: 10px;\n}\n\n.file-field input.file-path {\n  width: 100%;\n}\n\n.file-field .btn,\n.file-field .btn-large {\n  float: left;\n  height: 3rem;\n  line-height: 3rem;\n}\n\n.file-field span {\n  cursor: pointer;\n}\n\n.file-field input[type=file] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n  width: 100%;\n  margin: 0;\n  padding: 0;\n  font-size: 20px;\n  cursor: pointer;\n  opacity: 0;\n  filter: alpha(opacity=0);\n}\n\n.file-field input[type=file]::-webkit-file-upload-button {\n  display: none;\n}\n\n/* Range\r\n   ========================================================================== */\n\n.range-field {\n  position: relative;\n}\n\ninput[type=range],\ninput[type=range] + .thumb {\n  cursor: pointer;\n}\n\ninput[type=range] {\n  position: relative;\n  background-color: transparent;\n  border: none;\n  outline: none;\n  width: 100%;\n  margin: 15px 0;\n  padding: 0;\n}\n\ninput[type=range]:focus {\n  outline: none;\n}\n\ninput[type=range] + .thumb {\n  position: absolute;\n  top: 10px;\n  left: 0;\n  border: none;\n  height: 0;\n  width: 0;\n  border-radius: 50%;\n  background-color: #26a69a;\n  margin-left: 7px;\n  -webkit-transform-origin: 50% 50%;\n       -o-transform-origin: 50% 50%;\n          transform-origin: 50% 50%;\n  -webkit-transform: rotate(-45deg);\n       -o-transform: rotate(-45deg);\n          transform: rotate(-45deg);\n}\n\ninput[type=range] + .thumb .value {\n  display: block;\n  width: 30px;\n  text-align: center;\n  color: #26a69a;\n  font-size: 0;\n  -webkit-transform: rotate(45deg);\n       -o-transform: rotate(45deg);\n          transform: rotate(45deg);\n}\n\ninput[type=range] + .thumb.active {\n  border-radius: 50% 50% 50% 0;\n}\n\ninput[type=range] + .thumb.active .value {\n  color: #fff;\n  margin-left: -1px;\n  margin-top: 8px;\n  font-size: 10px;\n}\n\ninput[type=range] {\n  -webkit-appearance: none;\n}\n\ninput[type=range]::-webkit-slider-runnable-track {\n  height: 3px;\n  background: #c2c0c2;\n  border: none;\n}\n\ninput[type=range]::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  border: none;\n  height: 14px;\n  width: 14px;\n  border-radius: 50%;\n  background-color: #26a69a;\n  -webkit-transform-origin: 50% 50%;\n          transform-origin: 50% 50%;\n  margin: -5px 0 0 0;\n  -webkit-transition: .3s;\n  -o-transition: .3s;\n  transition: .3s;\n}\n\ninput[type=range]:focus::-webkit-slider-runnable-track {\n  background: #ccc;\n}\n\ninput[type=range] {\n  /* fix for FF unable to apply focus style bug  */\n  border: 1px solid white;\n  /*required for proper track sizing in FF*/\n}\n\ninput[type=range]::-moz-range-track {\n  height: 3px;\n  background: #ddd;\n  border: none;\n}\n\ninput[type=range]::-moz-range-thumb {\n  border: none;\n  height: 14px;\n  width: 14px;\n  border-radius: 50%;\n  background: #26a69a;\n  margin-top: -5px;\n}\n\ninput[type=range]:-moz-focusring {\n  outline: 1px solid #fff;\n  outline-offset: -1px;\n}\n\ninput[type=range]:focus::-moz-range-track {\n  background: #ccc;\n}\n\ninput[type=range]::-ms-track {\n  height: 3px;\n  background: transparent;\n  border-color: transparent;\n  border-width: 6px 0;\n  /*remove default tick marks*/\n  color: transparent;\n}\n\ninput[type=range]::-ms-fill-lower {\n  background: #777;\n}\n\ninput[type=range]::-ms-fill-upper {\n  background: #ddd;\n}\n\ninput[type=range]::-ms-thumb {\n  border: none;\n  height: 14px;\n  width: 14px;\n  border-radius: 50%;\n  background: #26a69a;\n}\n\ninput[type=range]:focus::-ms-fill-lower {\n  background: #888;\n}\n\ninput[type=range]:focus::-ms-fill-upper {\n  background: #ccc;\n}\n\n/** Import theme styles */\n\n/** Colors */\n\n/** Fonts */\n\n/** Font Sizes */\n\n/** Box Model  */\n\n/** Modified Grid */\n\n/** Flow Text  */\n\n/** Gradients */\n\nhtml {\n  font-size: 18px;\n}\n\nhtml[data-text-size=\"medium\"] {\n  font-size: 20px;\n}\n\nhtml[data-text-size=\"large\"] {\n  font-size: 24px;\n}\n\n@media only screen and (max-width: 600px) {\n  html {\n    font-size: 16px;\n  }\n}\n\nbody {\n  font-family: \"Montserrat\", sans-serif;\n}\n\n* {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n\n@media only screen and (min-width: 601px) {\n  .container {\n    width: 95%;\n  }\n}\n\n@media only screen and (min-width: 993px) {\n  .container {\n    width: 90%;\n  }\n}\n\n.content {\n  position: relative;\n  z-index: 3;\n}\n\n.flex {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n\n@media only screen and (max-width: 600px) {\n  .flex {\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap;\n  }\n}\n\n.flex-center {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n\n.flex-end {\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n}\n\n.flex-bottom {\n  -webkit-box-align: end;\n      -ms-flex-align: end;\n          align-items: flex-end;\n}\n\n.flex-wrap {\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n}\n\n.flex-grid {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n}\n\n.flex-grid .flex-item {\n  padding: 10px;\n}\n\n.flex-grid.s1x .flex-item {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  position: relative;\n}\n\n@media only screen and (max-width: 600px) {\n  .flex-grid.s1x .flex-item {\n    width: 100%;\n  }\n}\n\n.flex-grid.m2x .flex-item {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  position: relative;\n}\n\n@media only screen and (min-width: 601px) {\n  .flex-grid.m2x .flex-item {\n    width: 50%;\n  }\n}\n\n.space-between {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n}\n\n.space-evenly {\n  -webkit-box-pack: space-evenly;\n      -ms-flex-pack: space-evenly;\n          justify-content: space-evenly;\n}\n\n.mega-link.mega-link {\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 5;\n}\n\n@media only screen and (max-width: 600px) {\n  .row .col.xs12 {\n    width: 100%;\n  }\n}\n\nimg {\n  max-width: 100%;\n  height: auto;\n}\n\n.page .main {\n  margin-bottom: 2rem;\n}\n\nh1 {\n  font-size: 35px;\n  text-transform: uppercase;\n  text-align: center;\n  color: #006993;\n}\n\nh2 {\n  font-size: 30px;\n  text-transform: uppercase;\n  text-align: center;\n  color: #006993;\n}\n\nh3 {\n  font-size: 20px;\n  color: #006993;\n}\n\na {\n  color: #006993;\n}\n\n.screen-reader-text {\n  clip: rect(1px, 1px, 1px, 1px);\n  -webkit-clip-path: polygon(0 0, 0 0, 0 0, 0 0);\n          clip-path: polygon(0 0, 0 0, 0 0, 0 0);\n  position: absolute !important;\n  white-space: nowrap;\n  height: 1px;\n  width: 1px;\n  overflow: hidden;\n}\n\n.screen-reader-text:focus {\n  clip: auto;\n  -webkit-clip-path: none;\n          clip-path: none;\n  display: block;\n  height: auto;\n  left: 5px;\n  top: 5px;\n  width: auto;\n  z-index: 100000;\n  /* Above WP toolbar. */\n}\n\n.a11y-tools-trigger-wrapper {\n  position: absolute;\n  right: 5%;\n  top: 5px;\n  -webkit-transition: top 0.3s ease;\n  -o-transition: top 0.3s ease;\n  transition: top 0.3s ease;\n}\n\n@media only screen and (max-width: 600px) {\n  .a11y-tools-active .a11y-tools-trigger-wrapper {\n    top: 125px;\n  }\n}\n\n.a11y-tools-trigger-wrapper input:focus + label {\n  outline: #404040 auto 5px;\n}\n\n.a11y-tools-trigger-wrapper label {\n  display: block;\n  background: #000;\n  border-radius: 100%;\n  width: 50px;\n  height: 50px;\n  text-align: center;\n  cursor: pointer;\n  -webkit-transition: background 0.3s ease;\n  -o-transition: background 0.3s ease;\n  transition: background 0.3s ease;\n}\n\n.a11y-tools-trigger-wrapper label i {\n  position: absolute;\n  left: 0;\n  width: 100%;\n  top: 50%;\n  -webkit-transform: translateY(-50%);\n       -o-transform: translateY(-50%);\n          transform: translateY(-50%);\n  color: #fff;\n}\n\n.a11y-tools-trigger-wrapper label span {\n  display: none;\n}\n\n.a11y-tools-trigger-wrapper label:hover {\n  background: #004560;\n}\n\nhtml[data-contrast=\"true\"] .a11y-tools-trigger-wrapper label {\n  border: 3px solid #fff;\n}\n\nhtml[data-contrast=\"true\"] .a11y-tools-trigger-wrapper label:hover {\n  background: #fff;\n}\n\nhtml[data-contrast=\"true\"] .a11y-tools-trigger-wrapper label:hover i {\n  color: #000;\n}\n\n.a11y-tools {\n  height: 50px;\n  overflow: hidden;\n  -webkit-transition: height 0.3s ease;\n  -o-transition: height 0.3s ease;\n  transition: height 0.3s ease;\n  position: relative;\n}\n\n@media only screen and (max-width: 600px) {\n  .a11y-tools {\n    height: 0;\n  }\n\n  .a11y-tools-active .a11y-tools {\n    height: 110px;\n  }\n}\n\nhtml[data-contrast=\"true\"] .a11y-tools {\n  border-bottom: 1px solid #fff;\n}\n\n@media only screen and (min-width: 993px) {\n  .a11y-tools .container {\n    padding-right: 15px;\n  }\n}\n\n.a11y-tools fieldset {\n  border: none;\n  padding: 0;\n  margin: 0;\n}\n\n@media only screen and (max-width: 600px) {\n  .a11y-tools fieldset {\n    padding-bottom: 10px;\n  }\n}\n\n.a11y-tools fieldset legend,\n.a11y-tools fieldset > div {\n  display: block;\n  float: left;\n  padding: 0 3px;\n}\n\n.a11y-tools fieldset legend {\n  width: 65px;\n  font-size: 12px;\n  padding-top: 8px;\n}\n\n@media only screen and (max-width: 600px) {\n  .a11y-tools fieldset legend {\n    display: none;\n  }\n}\n\n.a11y-tools fieldset label {\n  display: block;\n  text-indent: -100em;\n  overflow: hidden;\n  width: 50px;\n  height: 50px;\n  position: relative;\n  background: #dcd8d8;\n  -webkit-transition: background 0.3s ease;\n  -o-transition: background 0.3s ease;\n  transition: background 0.3s ease;\n  cursor: pointer;\n}\n\n.a11y-tools fieldset label::after {\n  position: absolute;\n  left: 0;\n  width: 100%;\n  color: #000;\n}\n\n.a11y-tools fieldset label:hover {\n  background: #909090;\n}\n\n.a11y-tools fieldset label:hover::after {\n  color: #fff;\n}\n\nhtml[data-contrast=\"true\"] .a11y-tools fieldset label {\n  background: #000;\n  border: 1px solid #fff;\n}\n\nhtml[data-contrast=\"true\"] .a11y-tools fieldset label::after {\n  color: #fff;\n}\n\nhtml[data-contrast=\"true\"] .a11y-tools fieldset label:hover,\nhtml[data-contrast=\"true\"] .a11y-tools fieldset label:focus {\n  background: #fff;\n}\n\nhtml[data-contrast=\"true\"] .a11y-tools fieldset label:hover::after,\nhtml[data-contrast=\"true\"] .a11y-tools fieldset label:focus::after {\n  color: #000;\n}\n\n.a11y-tools fieldset input[type=\"radio\"]:checked + label {\n  background: #c9d9e3;\n}\n\n.a11y-tools fieldset input[type=\"radio\"]:checked + label::after {\n  color: #fff;\n}\n\nhtml[data-contrast=\"true\"] .a11y-tools fieldset input[type=\"radio\"]:checked + label {\n  background: #404040;\n}\n\n.a11y-tools fieldset input[type=\"radio\"]:focus + label {\n  outline: #404040 auto 5px;\n}\n\nhtml[data-contrast=\"true\"] .a11y-tools fieldset input[type=\"radio\"]:focus + label {\n  outline: #fff auto 5px;\n}\n\n.a11y-tools fieldset input[type=\"checkbox\"]:checked + label {\n  background: #c9d9e3;\n}\n\n.a11y-tools fieldset input[type=\"checkbox\"]:checked + label::after {\n  background-image: url(" + escape(__webpack_require__(/*! ../images/icon-contrast-inverse.svg */ 28)) + ");\n}\n\nhtml[data-contrast=\"true\"] .a11y-tools fieldset input[type=\"checkbox\"]:checked + label {\n  background: #404040;\n}\n\nhtml[data-contrast=\"true\"] .a11y-tools fieldset input[type=\"checkbox\"]:checked + label:hover,\nhtml[data-contrast=\"true\"] .a11y-tools fieldset input[type=\"checkbox\"]:checked + label:focus {\n  background: #909090;\n}\n\n.a11y-tools fieldset input[type=\"checkbox\"]:focus + label {\n  outline: #404040 auto 5px;\n}\n\nhtml[data-contrast=\"true\"] .a11y-tools fieldset input[type=\"checkbox\"]:focus + label {\n  outline: #fff auto 5px;\n}\n\n.a11y-tools fieldset.toggle-contrast label::after {\n  content: '';\n  top: 0;\n  height: 100%;\n  background: url(" + escape(__webpack_require__(/*! ../images/icon-contrast.svg */ 29)) + ") no-repeat 50% 50%;\n}\n\n.a11y-tools fieldset.text-size label::after {\n  content: 'A';\n  top: 50%;\n  -webkit-transform: translateY(-50%);\n       -o-transform: translateY(-50%);\n          transform: translateY(-50%);\n  text-indent: 0;\n  text-align: center;\n  -webkit-transition: color 0.3s ease;\n  -o-transition: color 0.3s ease;\n  transition: color 0.3s ease;\n  speak: none;\n}\n\n.a11y-tools fieldset.text-size div[class*=\"default-\"] label::after {\n  font-size: 18px;\n}\n\n.a11y-tools fieldset.text-size div[class*=\"medium-\"] label::after {\n  font-size: 24px;\n}\n\n.a11y-tools fieldset.text-size div[class*=\"large-\"] label::after {\n  font-size: 27px;\n}\n\n.a11y-tools .search-form {\n  margin-left: 6px;\n  width: auto;\n  -ms-flex-item-align: start;\n      align-self: flex-start;\n}\n\n.a11y-tools .search-form .label {\n  float: left;\n  width: 45px;\n  white-space: normal;\n  padding-top: 8px;\n  font-size: 12px;\n  line-height: 1.5;\n  font-family: \"Montserrat\", sans-serif;\n  font-weight: normal;\n}\n\n.a11y-tools .search-form .search-field {\n  float: left;\n  overflow: hidden;\n  -webkit-transition: all 0.3s ease;\n  -o-transition: all 0.3s ease;\n  transition: all 0.3s ease;\n  width: 0;\n  padding: 0;\n}\n\n.a11y-tools .search-form.active .search-field {\n  width: 200px;\n  padding: 0 10px;\n}\n\n@media only screen and (max-width: 600px) {\n  .a11y-tools .search-form .search-field {\n    width: 250px;\n    padding: 0 10px;\n  }\n}\n\n@media only screen and (max-width: 600px) {\n  .a11y-tools .search-form {\n    margin-left: 0;\n  }\n\n  .a11y-tools .search-form .label {\n    display: none;\n  }\n\n  .a11y-tools .search-form .search-field {\n    width: 225px;\n  }\n}\n\nhtml[data-contrast=\"true\"] .a11y-tools .search-form .label {\n  color: #fff;\n}\n\nhtml[data-contrast=\"true\"] {\n  background: #000;\n  color: #fff;\n}\n\nhtml[data-contrast=\"true\"] .banner .navbar,\nhtml[data-contrast=\"true\"] .page-footer .footer-copyright {\n  background: #000;\n  border-top: 1px solid #fff;\n  border-bottom: 1px solid #fff;\n}\n\nhtml[data-contrast=\"true\"] .navbar-menu li.current-page-ancestor,\nhtml[data-contrast=\"true\"] .navbar-menu li.current-menu-item,\nhtml[data-contrast=\"true\"] .navbar-menu li:hover,\nhtml[data-contrast=\"true\"] .navbar-menu li:focus,\nhtml[data-contrast=\"true\"] .navbar-menu li.hover {\n  background: #404040;\n  border-right: 1px solid #fff;\n  border-left: 1px solid #fff;\n}\n\nhtml[data-contrast=\"true\"] .btn,\nhtml[data-contrast=\"true\"] .btn-large,\nhtml[data-contrast=\"true\"] .social-icons li a,\nhtml[data-contrast=\"true\"] .page-footer .widget_nav_menu .menu li a {\n  background: #000;\n  border-color: #fff;\n}\n\nhtml[data-contrast=\"true\"] .btn:hover,\nhtml[data-contrast=\"true\"] .btn-large:hover,\nhtml[data-contrast=\"true\"] .btn:focus,\nhtml[data-contrast=\"true\"] .btn-large:focus,\nhtml[data-contrast=\"true\"] .social-icons li a:hover,\nhtml[data-contrast=\"true\"] .social-icons li a:focus,\nhtml[data-contrast=\"true\"] .page-footer .widget_nav_menu .menu li a:hover,\nhtml[data-contrast=\"true\"] .page-footer .widget_nav_menu .menu li a:focus {\n  background: #fff;\n  color: #000;\n}\n\nhtml[data-contrast=\"true\"] select,\nhtml[data-contrast=\"true\"] input[type=\"text\"] {\n  border-color: #fff;\n  background: #000;\n  color: #fff;\n}\n\nhtml[data-contrast=\"true\"] h1,\nhtml[data-contrast=\"true\"] h2,\nhtml[data-contrast=\"true\"] h3,\nhtml[data-contrast=\"true\"] h4,\nhtml[data-contrast=\"true\"] h5,\nhtml[data-contrast=\"true\"] h6,\nhtml[data-contrast=\"true\"] .h1,\nhtml[data-contrast=\"true\"] .h2,\nhtml[data-contrast=\"true\"] .h3,\nhtml[data-contrast=\"true\"] .h4,\nhtml[data-contrast=\"true\"] .h5,\nhtml[data-contrast=\"true\"] .h6,\nhtml[data-contrast=\"true\"] a {\n  color: #fff;\n}\n\nhtml[data-contrast=\"true\"] .banner .logo img {\n  background-size: contain;\n  display: block;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  padding-left: 100%;\n  padding-top: 27.65%;\n  overflow: hidden;\n}\n\nhtml[data-contrast=\"true\"] .events-list.events-list time,\nhtml[data-contrast=\"true\"] .single-mc-events time {\n  background: #000;\n  border-color: #404040;\n}\n\n.btn,\n.btn-large {\n  background-color: #f68026;\n  background-image: -webkit-gradient(linear, left top, right bottom, color-stop(0, transparent), color-stop(50%, transparent), color-stop(50%, #e06609), to(#e06609));\n  background-image: -webkit-linear-gradient(top left, transparent 0, transparent 50%, #e06609 50%, #e06609 100%);\n  background-image: -o-linear-gradient(top left, transparent 0, transparent 50%, #e06609 50%, #e06609 100%);\n  background-image: linear-gradient(to bottom right, transparent 0, transparent 50%, #e06609 50%, #e06609 100%);\n  padding: 1em;\n  text-align: center;\n  margin: 1em 0;\n  line-height: 28px;\n  width: 300px;\n  height: 60px;\n  font-size: 18px;\n}\n\n.btn:hover,\n.btn-large:hover {\n  background-color: #e06609;\n}\n\n.btn:active,\n.btn-large:active,\n.btn:focus,\n.btn-large:focus {\n  border: 1px solid black;\n}\n\n/** Search form */\n\n/**\n * WordPress Generated Classes\n * @see http://codex.wordpress.org/CSS#WordPress_Generated_Classes\n */\n\n/** Media alignment */\n\n.alignnone {\n  margin-left: 0;\n  margin-right: 0;\n  max-width: 100%;\n  height: auto;\n}\n\n.aligncenter {\n  display: block;\n  margin: 1rem auto;\n  height: auto;\n}\n\n.alignleft,\n.alignright {\n  margin-bottom: 1rem;\n  height: auto;\n}\n\n@media (min-width: 30rem) {\n  .alignleft {\n    float: left;\n    margin-right: 1rem;\n  }\n\n  .alignright {\n    float: right;\n    margin-left: 1rem;\n  }\n}\n\n/** Captions */\n\n/** Text meant only for screen readers */\n\n.screen-reader-text {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  border: 0;\n  color: #000;\n  background: #fff;\n}\n\n.nav-primary {\n  background: #006993;\n  font-weight: 300;\n}\n\n.nav-primary ul {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: distribute;\n      justify-content: space-around;\n}\n\n.unity-link {\n  display: inline-block;\n  max-width: 120px;\n  max-height: 23px;\n  float: right;\n}\n\n.svg-unity-logo {\n  width: 100%;\n  height: auto;\n  max-height: 23px;\n  display: inline-block;\n  vertical-align: middle;\n}\n\n.svg-unity-logo path {\n  fill: #fff;\n}\n\n#menu-social-menu {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n\n#menu-social-menu li a {\n  display: block;\n  position: relative;\n  height: 40px;\n  width: 40px;\n  margin: 0 7px;\n}\n\n#menu-social-menu li a::before {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 40px;\n  height: 40px;\n  background-repeat: no-repeat;\n  background-size: contain;\n  background-position: center;\n}\n\n#menu-social-menu li.facebook-footer a::before {\n  background-image: url(" + escape(__webpack_require__(/*! ../images/facebook.svg */ 30)) + ");\n}\n\n#menu-social-menu li.instagram-footer a::before {\n  background-image: url(" + escape(__webpack_require__(/*! ../images/instagram.svg */ 31)) + ");\n}\n\n#menu-social-menu li.twitter-footer a::before {\n  background-image: url(" + escape(__webpack_require__(/*! ../images/twitter.svg */ 32)) + ");\n}\n\nheader {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: distribute;\n      justify-content: space-around;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n\nfooter {\n  background: #006993;\n  color: #fff;\n  padding: 5px 1em;\n  font-weight: 300;\n  padding-top: 1.5em;\n}\n\nfooter .m4:nth-of-type(2) {\n  text-align: center;\n}\n\nfooter .m4:nth-of-type(3) {\n  text-align: right;\n}\n\nfooter .row {\n  margin-bottom: 0;\n}\n\nfooter .textwidget p {\n  margin: 0;\n}\n\n.footer-copyright {\n  background: #004560;\n  color: #fff;\n  font-weight: 300;\n  font-size: 15px;\n  padding: 5px 1em;\n}\n\n.footer-copyright a {\n  color: white;\n}\n\n.footer-copyright .row {\n  margin-bottom: 0;\n}\n\n.footer-copyright .m4:nth-of-type(2) {\n  text-align: center;\n}\n\nbody#tinymce {\n  margin: 12px !important;\n}\n\n.home .hero {\n  text-align: center;\n  margin-bottom: 2em;\n}\n\n.home .hero img {\n  width: 100%;\n  height: 400px;\n  -o-object-fit: cover;\n     object-fit: cover;\n}\n\n.home .hero .btn:nth-of-type(2),\n.home .hero .btn-large:nth-of-type(2) {\n  background-color: #006993;\n  background-image: -webkit-gradient(linear, left top, right bottom, color-stop(0, transparent), color-stop(50%, transparent), color-stop(50%, #004560), to(#004560));\n  background-image: -webkit-linear-gradient(top left, transparent 0, transparent 50%, #004560 50%, #004560 100%);\n  background-image: -o-linear-gradient(top left, transparent 0, transparent 50%, #004560 50%, #004560 100%);\n  background-image: linear-gradient(to bottom right, transparent 0, transparent 50%, #004560 50%, #004560 100%);\n}\n\n.home .hero .btn:nth-of-type(2):hover,\n.home .hero .btn-large:nth-of-type(2):hover {\n  background-color: #004560;\n}\n\n.home .hero .btn:nth-of-type(3),\n.home .hero .btn-large:nth-of-type(3) {\n  background-color: #b7d331;\n  background-image: -webkit-gradient(linear, left top, right bottom, color-stop(0, transparent), color-stop(50%, transparent), color-stop(50%, #95ac25), to(#95ac25));\n  background-image: -webkit-linear-gradient(top left, transparent 0, transparent 50%, #95ac25 50%, #95ac25 100%);\n  background-image: -o-linear-gradient(top left, transparent 0, transparent 50%, #95ac25 50%, #95ac25 100%);\n  background-image: linear-gradient(to bottom right, transparent 0, transparent 50%, #95ac25 50%, #95ac25 100%);\n}\n\n.home .hero .btn:nth-of-type(3):hover,\n.home .hero .btn-large:nth-of-type(3):hover {\n  background-color: #95ac25;\n}\n\n.home .hero .btn:nth-of-type(4),\n.home .hero .btn-large:nth-of-type(4) {\n  background-color: #e3b831;\n  background-image: -webkit-gradient(linear, left top, right bottom, color-stop(0, transparent), color-stop(50%, transparent), color-stop(50%, #c69d1b), to(#c69d1b));\n  background-image: -webkit-linear-gradient(top left, transparent 0, transparent 50%, #c69d1b 50%, #c69d1b 100%);\n  background-image: -o-linear-gradient(top left, transparent 0, transparent 50%, #c69d1b 50%, #c69d1b 100%);\n  background-image: linear-gradient(to bottom right, transparent 0, transparent 50%, #c69d1b 50%, #c69d1b 100%);\n}\n\n.home .hero .btn:nth-of-type(4):hover,\n.home .hero .btn-large:nth-of-type(4):hover {\n  background-color: #c69d1b;\n}\n\n.home .services {\n  background: #c9d9e3;\n  padding: 2em 0;\n}\n\n.home .services .service-item {\n  height: 250px;\n  position: relative;\n  background-size: cover;\n  margin-bottom: 1em;\n  -webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);\n          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);\n}\n\n.home .services .service-item h3 {\n  background: #fff;\n  padding: 1em;\n  margin: 0;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  text-align: center;\n}\n\n.home .overview h2 {\n  text-align: left;\n}\n\n", "", {"version":3,"sources":["/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/resources/assets/styles/main.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/main.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/node_modules/materialize-css/sass/components/_color.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/node_modules/materialize-css/sass/components/_normalize.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/node_modules/materialize-css/sass/components/_global.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/node_modules/materialize-css/sass/components/_grid.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/node_modules/materialize-css/sass/components/_navbar.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/node_modules/materialize-css/sass/components/_typography.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/node_modules/materialize-css/sass/components/_buttons.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/node_modules/materialize-css/sass/components/_dropdown.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/node_modules/materialize-css/sass/components/_collapsible.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/node_modules/materialize-css/sass/components/forms/_forms.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/node_modules/materialize-css/sass/components/forms/_input-fields.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/node_modules/materialize-css/sass/components/forms/_radio-buttons.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/node_modules/materialize-css/sass/components/forms/_checkboxes.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/node_modules/materialize-css/sass/components/forms/_switches.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/node_modules/materialize-css/sass/components/forms/_select.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/node_modules/materialize-css/sass/components/forms/_file-input.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/node_modules/materialize-css/sass/components/forms/_range.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/resources/assets/styles/common/_variables.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/resources/assets/styles/common/_global.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/resources/assets/styles/common/_typography.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/resources/assets/styles/common/_a11y.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/resources/assets/styles/components/_buttons.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/resources/assets/styles/components/_forms.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/resources/assets/styles/components/_wp-classes.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/resources/assets/styles/components/_navigation.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/resources/assets/styles/components/_unity.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/resources/assets/styles/components/_socialicons.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/resources/assets/styles/layouts/_header.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/resources/assets/styles/layouts/_footer.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/resources/assets/styles/layouts/_tinymce.scss","/Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/styles/resources/assets/styles/pages/_home.scss"],"names":[],"mappings":"AAAA,sCAAA;;AAGA;;;;;GCIG;;AC0WG;EACE,qCAAA;CDvWP;;ACyWK;EACE,0BAAA;CDtWP;;AC0WK;EACE,qCAAA;CDvWP;;ACyWK;EACE,0BAAA;CDtWP;;ACkWK;EACE,qCAAA;CD/VP;;ACiWK;EACE,0BAAA;CD9VP;;AC0VK;EACE,qCAAA;CDvVP;;ACyVK;EACE,0BAAA;CDtVP;;ACkVK;EACE,qCAAA;CD/UP;;ACiVK;EACE,0BAAA;CD9UP;;AC0UK;EACE,qCAAA;CDvUP;;ACyUK;EACE,0BAAA;CDtUP;;ACkUK;EACE,qCAAA;CD/TP;;ACiUK;EACE,0BAAA;CD9TP;;AC0TK;EACE,qCAAA;CDvTP;;ACyTK;EACE,0BAAA;CDtTP;;ACkTK;EACE,qCAAA;CD/SP;;ACiTK;EACE,0BAAA;CD9SP;;AC0SK;EACE,qCAAA;CDvSP;;ACySK;EACE,0BAAA;CDtSP;;AC0RK;EACE,qCAAA;CDvRP;;ACyRK;EACE,0BAAA;CDtRP;;AC0RK;EACE,qCAAA;CDvRP;;ACyRK;EACE,0BAAA;CDtRP;;ACkRK;EACE,qCAAA;CD/QP;;ACiRK;EACE,0BAAA;CD9QP;;AC0QK;EACE,qCAAA;CDvQP;;ACyQK;EACE,0BAAA;CDtQP;;ACkQK;EACE,qCAAA;CD/PP;;ACiQK;EACE,0BAAA;CD9PP;;AC0PK;EACE,qCAAA;CDvPP;;ACyPK;EACE,0BAAA;CDtPP;;ACkPK;EACE,qCAAA;CD/OP;;ACiPK;EACE,0BAAA;CD9OP;;AC0OK;EACE,qCAAA;CDvOP;;ACyOK;EACE,0BAAA;CDtOP;;ACkOK;EACE,qCAAA;CD/NP;;ACiOK;EACE,0BAAA;CD9NP;;AC0NK;EACE,qCAAA;CDvNP;;ACyNK;EACE,0BAAA;CDtNP;;ACkNK;EACE,qCAAA;CD/MP;;ACiNK;EACE,0BAAA;CD9MP;;AC0MK;EACE,qCAAA;CDvMP;;ACyMK;EACE,0BAAA;CDtMP;;ACkMK;EACE,qCAAA;CD/LP;;ACiMK;EACE,0BAAA;CD9LP;;AC0LK;EACE,qCAAA;CDvLP;;ACyLK;EACE,0BAAA;CDtLP;;AC0KK;EACE,qCAAA;CDvKP;;ACyKK;EACE,0BAAA;CDtKP;;AC0KK;EACE,qCAAA;CDvKP;;ACyKK;EACE,0BAAA;CDtKP;;ACkKK;EACE,qCAAA;CD/JP;;ACiKK;EACE,0BAAA;CD9JP;;AC0JK;EACE,qCAAA;CDvJP;;ACyJK;EACE,0BAAA;CDtJP;;ACkJK;EACE,qCAAA;CD/IP;;ACiJK;EACE,0BAAA;CD9IP;;AC0IK;EACE,qCAAA;CDvIP;;ACyIK;EACE,0BAAA;CDtIP;;ACkIK;EACE,qCAAA;CD/HP;;ACiIK;EACE,0BAAA;CD9HP;;AC0HK;EACE,qCAAA;CDvHP;;ACyHK;EACE,0BAAA;CDtHP;;ACkHK;EACE,qCAAA;CD/GP;;ACiHK;EACE,0BAAA;CD9GP;;AC0GK;EACE,qCAAA;CDvGP;;ACyGK;EACE,0BAAA;CDtGP;;ACkGK;EACE,qCAAA;CD/FP;;ACiGK;EACE,0BAAA;CD9FP;;AC0FK;EACE,qCAAA;CDvFP;;ACyFK;EACE,0BAAA;CDtFP;;ACkFK;EACE,qCAAA;CD/EP;;ACiFK;EACE,0BAAA;CD9EP;;AC0EK;EACE,qCAAA;CDvEP;;ACyEK;EACE,0BAAA;CDtEP;;AC0DK;EACE,qCAAA;CDvDP;;ACyDK;EACE,0BAAA;CDtDP;;AC0DK;EACE,qCAAA;CDvDP;;ACyDK;EACE,0BAAA;CDtDP;;ACkDK;EACE,qCAAA;CD/CP;;ACiDK;EACE,0BAAA;CD9CP;;AC0CK;EACE,qCAAA;CDvCP;;ACyCK;EACE,0BAAA;CDtCP;;ACkCK;EACE,qCAAA;CD/BP;;ACiCK;EACE,0BAAA;CD9BP;;AC0BK;EACE,qCAAA;CDvBP;;ACyBK;EACE,0BAAA;CDtBP;;ACkBK;EACE,qCAAA;CDfP;;ACiBK;EACE,0BAAA;CDdP;;ACUK;EACE,qCAAA;CDPP;;ACSK;EACE,0BAAA;CDNP;;ACEK;EACE,qCAAA;CDCP;;ACCK;EACE,0BAAA;CDEP;;ACNK;EACE,qCAAA;CDSP;;ACPK;EACE,0BAAA;CDUP;;ACdK;EACE,qCAAA;CDiBP;;ACfK;EACE,0BAAA;CDkBP;;ACtBK;EACE,qCAAA;CDyBP;;ACvBK;EACE,0BAAA;CD0BP;;AC9BK;EACE,qCAAA;CDiCP;;AC/BK;EACE,0BAAA;CDkCP;;ACtCK;EACE,qCAAA;CDyCP;;ACvCK;EACE,0BAAA;CD0CP;;ACtDK;EACE,qCAAA;CDyDP;;ACvDK;EACE,0BAAA;CD0DP;;ACtDK;EACE,qCAAA;CDyDP;;ACvDK;EACE,0BAAA;CD0DP;;AC9DK;EACE,qCAAA;CDiEP;;AC/DK;EACE,0BAAA;CDkEP;;ACtEK;EACE,qCAAA;CDyEP;;ACvEK;EACE,0BAAA;CD0EP;;AC9EK;EACE,qCAAA;CDiFP;;AC/EK;EACE,0BAAA;CDkFP;;ACtFK;EACE,qCAAA;CDyFP;;ACvFK;EACE,0BAAA;CD0FP;;AC9FK;EACE,qCAAA;CDiGP;;AC/FK;EACE,0BAAA;CDkGP;;ACtGK;EACE,qCAAA;CDyGP;;ACvGK;EACE,0BAAA;CD0GP;;AC9GK;EACE,qCAAA;CDiHP;;AC/GK;EACE,0BAAA;CDkHP;;ACtHK;EACE,qCAAA;CDyHP;;ACvHK;EACE,0BAAA;CD0HP;;AC9HK;EACE,qCAAA;CDiIP;;AC/HK;EACE,0BAAA;CDkIP;;ACtIK;EACE,qCAAA;CDyIP;;ACvIK;EACE,0BAAA;CD0IP;;AC9IK;EACE,qCAAA;CDiJP;;AC/IK;EACE,0BAAA;CDkJP;;ACtJK;EACE,qCAAA;CDyJP;;ACvJK;EACE,0BAAA;CD0JP;;ACtKK;EACE,qCAAA;CDyKP;;ACvKK;EACE,0BAAA;CD0KP;;ACtKK;EACE,qCAAA;CDyKP;;ACvKK;EACE,0BAAA;CD0KP;;AC9KK;EACE,qCAAA;CDiLP;;AC/KK;EACE,0BAAA;CDkLP;;ACtLK;EACE,qCAAA;CDyLP;;ACvLK;EACE,0BAAA;CD0LP;;AC9LK;EACE,qCAAA;CDiMP;;AC/LK;EACE,0BAAA;CDkMP;;ACtMK;EACE,qCAAA;CDyMP;;ACvMK;EACE,0BAAA;CD0MP;;AC9MK;EACE,qCAAA;CDiNP;;AC/MK;EACE,0BAAA;CDkNP;;ACtNK;EACE,qCAAA;CDyNP;;ACvNK;EACE,0BAAA;CD0NP;;AC9NK;EACE,qCAAA;CDiOP;;AC/NK;EACE,0BAAA;CDkOP;;ACtOK;EACE,qCAAA;CDyOP;;ACvOK;EACE,0BAAA;CD0OP;;AC9OK;EACE,qCAAA;CDiPP;;AC/OK;EACE,0BAAA;CDkPP;;ACtPK;EACE,qCAAA;CDyPP;;ACvPK;EACE,0BAAA;CD0PP;;AC9PK;EACE,qCAAA;CDiQP;;AC/PK;EACE,0BAAA;CDkQP;;ACtQK;EACE,qCAAA;CDyQP;;ACvQK;EACE,0BAAA;CD0QP;;ACtRK;EACE,qCAAA;CDyRP;;ACvRK;EACE,0BAAA;CD0RP;;ACtRK;EACE,qCAAA;CDyRP;;ACvRK;EACE,0BAAA;CD0RP;;AC9RK;EACE,qCAAA;CDiSP;;AC/RK;EACE,0BAAA;CDkSP;;ACtSK;EACE,qCAAA;CDySP;;ACvSK;EACE,0BAAA;CD0SP;;AC9SK;EACE,qCAAA;CDiTP;;AC/SK;EACE,0BAAA;CDkTP;;ACtTK;EACE,qCAAA;CDyTP;;ACvTK;EACE,0BAAA;CD0TP;;AC9TK;EACE,qCAAA;CDiUP;;AC/TK;EACE,0BAAA;CDkUP;;ACtUK;EACE,qCAAA;CDyUP;;ACvUK;EACE,0BAAA;CD0UP;;AC9UK;EACE,qCAAA;CDiVP;;AC/UK;EACE,0BAAA;CDkVP;;ACtVK;EACE,qCAAA;CDyVP;;ACvVK;EACE,0BAAA;CD0VP;;AC9VK;EACE,qCAAA;CDiWP;;AC/VK;EACE,0BAAA;CDkWP;;ACtWK;EACE,qCAAA;CDyWP;;ACvWK;EACE,0BAAA;CD0WP;;AC9WK;EACE,qCAAA;CDiXP;;AC/WK;EACE,0BAAA;CDkXP;;ACtXK;EACE,qCAAA;CDyXP;;ACvXK;EACE,0BAAA;CD0XP;;ACtYK;EACE,qCAAA;CDyYP;;ACvYK;EACE,0BAAA;CD0YP;;ACtYK;EACE,qCAAA;CDyYP;;ACvYK;EACE,0BAAA;CD0YP;;AC9YK;EACE,qCAAA;CDiZP;;AC/YK;EACE,0BAAA;CDkZP;;ACtZK;EACE,qCAAA;CDyZP;;ACvZK;EACE,0BAAA;CD0ZP;;AC9ZK;EACE,qCAAA;CDiaP;;AC/ZK;EACE,0BAAA;CDkaP;;ACtaK;EACE,qCAAA;CDyaP;;ACvaK;EACE,0BAAA;CD0aP;;AC9aK;EACE,qCAAA;CDibP;;AC/aK;EACE,0BAAA;CDkbP;;ACtbK;EACE,qCAAA;CDybP;;ACvbK;EACE,0BAAA;CD0bP;;AC9bK;EACE,qCAAA;CDicP;;AC/bK;EACE,0BAAA;CDkcP;;ACtcK;EACE,qCAAA;CDycP;;ACvcK;EACE,0BAAA;CD0cP;;AC9cK;EACE,qCAAA;CDidP;;AC/cK;EACE,0BAAA;CDkdP;;ACtdK;EACE,qCAAA;CDydP;;ACvdK;EACE,0BAAA;CD0dP;;AC9dK;EACE,qCAAA;CDieP;;AC/dK;EACE,0BAAA;CDkeP;;ACteK;EACE,qCAAA;CDyeP;;ACveK;EACE,0BAAA;CD0eP;;ACtfK;EACE,qCAAA;CDyfP;;ACvfK;EACE,0BAAA;CD0fP;;ACtfK;EACE,qCAAA;CDyfP;;ACvfK;EACE,0BAAA;CD0fP;;AC9fK;EACE,qCAAA;CDigBP;;AC/fK;EACE,0BAAA;CDkgBP;;ACtgBK;EACE,qCAAA;CDygBP;;ACvgBK;EACE,0BAAA;CD0gBP;;AC9gBK;EACE,qCAAA;CDihBP;;AC/gBK;EACE,0BAAA;CDkhBP;;ACthBK;EACE,qCAAA;CDyhBP;;ACvhBK;EACE,0BAAA;CD0hBP;;AC9hBK;EACE,qCAAA;CDiiBP;;AC/hBK;EACE,0BAAA;CDkiBP;;ACtiBK;EACE,qCAAA;CDyiBP;;ACviBK;EACE,0BAAA;CD0iBP;;AC9iBK;EACE,qCAAA;CDijBP;;AC/iBK;EACE,0BAAA;CDkjBP;;ACtjBK;EACE,qCAAA;CDyjBP;;ACvjBK;EACE,0BAAA;CD0jBP;;AC9jBK;EACE,qCAAA;CDikBP;;AC/jBK;EACE,0BAAA;CDkkBP;;ACtkBK;EACE,qCAAA;CDykBP;;ACvkBK;EACE,0BAAA;CD0kBP;;AC9kBK;EACE,qCAAA;CDilBP;;AC/kBK;EACE,0BAAA;CDklBP;;ACtlBK;EACE,qCAAA;CDylBP;;ACvlBK;EACE,0BAAA;CD0lBP;;ACtmBK;EACE,qCAAA;CDymBP;;ACvmBK;EACE,0BAAA;CD0mBP;;ACtmBK;EACE,qCAAA;CDymBP;;ACvmBK;EACE,0BAAA;CD0mBP;;AC9mBK;EACE,qCAAA;CDinBP;;AC/mBK;EACE,0BAAA;CDknBP;;ACtnBK;EACE,qCAAA;CDynBP;;ACvnBK;EACE,0BAAA;CD0nBP;;AC9nBK;EACE,qCAAA;CDioBP;;AC/nBK;EACE,0BAAA;CDkoBP;;ACtoBK;EACE,qCAAA;CDyoBP;;ACvoBK;EACE,0BAAA;CD0oBP;;AC9oBK;EACE,qCAAA;CDipBP;;AC/oBK;EACE,0BAAA;CDkpBP;;ACtpBK;EACE,qCAAA;CDypBP;;ACvpBK;EACE,0BAAA;CD0pBP;;AC9pBK;EACE,qCAAA;CDiqBP;;AC/pBK;EACE,0BAAA;CDkqBP;;ACtqBK;EACE,qCAAA;CDyqBP;;ACvqBK;EACE,0BAAA;CD0qBP;;AC9qBK;EACE,qCAAA;CDirBP;;AC/qBK;EACE,0BAAA;CDkrBP;;ACtrBK;EACE,qCAAA;CDyrBP;;ACvrBK;EACE,0BAAA;CD0rBP;;AC9rBK;EACE,qCAAA;CDisBP;;AC/rBK;EACE,0BAAA;CDksBP;;ACtsBK;EACE,qCAAA;CDysBP;;ACvsBK;EACE,0BAAA;CD0sBP;;ACttBK;EACE,qCAAA;CDytBP;;ACvtBK;EACE,0BAAA;CD0tBP;;ACttBK;EACE,qCAAA;CDytBP;;ACvtBK;EACE,0BAAA;CD0tBP;;AC9tBK;EACE,qCAAA;CDiuBP;;AC/tBK;EACE,0BAAA;CDkuBP;;ACtuBK;EACE,qCAAA;CDyuBP;;ACvuBK;EACE,0BAAA;CD0uBP;;AC9uBK;EACE,qCAAA;CDivBP;;AC/uBK;EACE,0BAAA;CDkvBP;;ACtvBK;EACE,qCAAA;CDyvBP;;ACvvBK;EACE,0BAAA;CD0vBP;;AC9vBK;EACE,qCAAA;CDiwBP;;AC/vBK;EACE,0BAAA;CDkwBP;;ACtwBK;EACE,qCAAA;CDywBP;;ACvwBK;EACE,0BAAA;CD0wBP;;AC9wBK;EACE,qCAAA;CDixBP;;AC/wBK;EACE,0BAAA;CDkxBP;;ACtxBK;EACE,qCAAA;CDyxBP;;ACvxBK;EACE,0BAAA;CD0xBP;;AC9xBK;EACE,qCAAA;CDiyBP;;AC/xBK;EACE,0BAAA;CDkyBP;;ACtyBK;EACE,qCAAA;CDyyBP;;ACvyBK;EACE,0BAAA;CD0yBP;;AC9yBK;EACE,qCAAA;CDizBP;;AC/yBK;EACE,0BAAA;CDkzBP;;ACtzBK;EACE,qCAAA;CDyzBP;;ACvzBK;EACE,0BAAA;CD0zBP;;ACt0BK;EACE,qCAAA;CDy0BP;;ACv0BK;EACE,0BAAA;CD00BP;;ACt0BK;EACE,qCAAA;CDy0BP;;ACv0BK;EACE,0BAAA;CD00BP;;AC90BK;EACE,qCAAA;CDi1BP;;AC/0BK;EACE,0BAAA;CDk1BP;;ACt1BK;EACE,qCAAA;CDy1BP;;ACv1BK;EACE,0BAAA;CD01BP;;AC91BK;EACE,qCAAA;CDi2BP;;AC/1BK;EACE,0BAAA;CDk2BP;;ACt2BK;EACE,qCAAA;CDy2BP;;ACv2BK;EACE,0BAAA;CD02BP;;AC92BK;EACE,qCAAA;CDi3BP;;AC/2BK;EACE,0BAAA;CDk3BP;;ACt3BK;EACE,qCAAA;CDy3BP;;ACv3BK;EACE,0BAAA;CD03BP;;AC93BK;EACE,qCAAA;CDi4BP;;AC/3BK;EACE,0BAAA;CDk4BP;;ACt4BK;EACE,qCAAA;CDy4BP;;ACv4BK;EACE,0BAAA;CD04BP;;AC94BK;EACE,qCAAA;CDi5BP;;AC/4BK;EACE,0BAAA;CDk5BP;;ACt5BK;EACE,qCAAA;CDy5BP;;ACv5BK;EACE,0BAAA;CD05BP;;AC95BK;EACE,qCAAA;CDi6BP;;AC/5BK;EACE,0BAAA;CDk6BP;;ACt6BK;EACE,qCAAA;CDy6BP;;ACv6BK;EACE,0BAAA;CD06BP;;ACt7BK;EACE,qCAAA;CDy7BP;;ACv7BK;EACE,0BAAA;CD07BP;;ACt7BK;EACE,qCAAA;CDy7BP;;ACv7BK;EACE,0BAAA;CD07BP;;AC97BK;EACE,qCAAA;CDi8BP;;AC/7BK;EACE,0BAAA;CDk8BP;;ACt8BK;EACE,qCAAA;CDy8BP;;ACv8BK;EACE,0BAAA;CD08BP;;AC98BK;EACE,qCAAA;CDi9BP;;AC/8BK;EACE,0BAAA;CDk9BP;;ACt9BK;EACE,qCAAA;CDy9BP;;ACv9BK;EACE,0BAAA;CD09BP;;AC99BK;EACE,qCAAA;CDi+BP;;AC/9BK;EACE,0BAAA;CDk+BP;;ACt+BK;EACE,qCAAA;CDy+BP;;ACv+BK;EACE,0BAAA;CD0+BP;;AC9+BK;EACE,qCAAA;CDi/BP;;AC/+BK;EACE,0BAAA;CDk/BP;;ACt/BK;EACE,qCAAA;CDy/BP;;ACv/BK;EACE,0BAAA;CD0/BP;;AC9/BK;EACE,qCAAA;CDigCP;;AC//BK;EACE,0BAAA;CDkgCP;;ACtgCK;EACE,qCAAA;CDygCP;;ACvgCK;EACE,0BAAA;CD0gCP;;AC9gCK;EACE,qCAAA;CDihCP;;AC/gCK;EACE,0BAAA;CDkhCP;;ACthCK;EACE,qCAAA;CDyhCP;;ACvhCK;EACE,0BAAA;CD0hCP;;ACtiCK;EACE,qCAAA;CDyiCP;;ACviCK;EACE,0BAAA;CD0iCP;;ACtiCK;EACE,qCAAA;CDyiCP;;ACviCK;EACE,0BAAA;CD0iCP;;AC9iCK;EACE,qCAAA;CDijCP;;AC/iCK;EACE,0BAAA;CDkjCP;;ACtjCK;EACE,qCAAA;CDyjCP;;ACvjCK;EACE,0BAAA;CD0jCP;;AC9jCK;EACE,qCAAA;CDikCP;;AC/jCK;EACE,0BAAA;CDkkCP;;ACtkCK;EACE,qCAAA;CDykCP;;ACvkCK;EACE,0BAAA;CD0kCP;;AC9kCK;EACE,qCAAA;CDilCP;;AC/kCK;EACE,0BAAA;CDklCP;;ACtlCK;EACE,qCAAA;CDylCP;;ACvlCK;EACE,0BAAA;CD0lCP;;AC9lCK;EACE,qCAAA;CDimCP;;AC/lCK;EACE,0BAAA;CDkmCP;;ACtmCK;EACE,qCAAA;CDymCP;;ACvmCK;EACE,0BAAA;CD0mCP;;AC9mCK;EACE,qCAAA;CDinCP;;AC/mCK;EACE,0BAAA;CDknCP;;ACtnCK;EACE,qCAAA;CDynCP;;ACvnCK;EACE,0BAAA;CD0nCP;;AC9nCK;EACE,qCAAA;CDioCP;;AC/nCK;EACE,0BAAA;CDkoCP;;ACtoCK;EACE,qCAAA;CDyoCP;;ACvoCK;EACE,0BAAA;CD0oCP;;ACtpCK;EACE,qCAAA;CDypCP;;ACvpCK;EACE,0BAAA;CD0pCP;;ACtpCK;EACE,qCAAA;CDypCP;;ACvpCK;EACE,0BAAA;CD0pCP;;AC9pCK;EACE,qCAAA;CDiqCP;;AC/pCK;EACE,0BAAA;CDkqCP;;ACtqCK;EACE,qCAAA;CDyqCP;;ACvqCK;EACE,0BAAA;CD0qCP;;AC9qCK;EACE,qCAAA;CDirCP;;AC/qCK;EACE,0BAAA;CDkrCP;;ACtrCK;EACE,qCAAA;CDyrCP;;ACvrCK;EACE,0BAAA;CD0rCP;;AC9rCK;EACE,qCAAA;CDisCP;;AC/rCK;EACE,0BAAA;CDksCP;;ACtsCK;EACE,qCAAA;CDysCP;;ACvsCK;EACE,0BAAA;CD0sCP;;AC9sCK;EACE,qCAAA;CDitCP;;AC/sCK;EACE,0BAAA;CDktCP;;ACttCK;EACE,qCAAA;CDytCP;;ACvtCK;EACE,0BAAA;CD0tCP;;AC9tCK;EACE,qCAAA;CDiuCP;;AC/tCK;EACE,0BAAA;CDkuCP;;ACtuCK;EACE,qCAAA;CDyuCP;;ACvuCK;EACE,0BAAA;CD0uCP;;AC9uCK;EACE,qCAAA;CDivCP;;AC/uCK;EACE,0BAAA;CDkvCP;;ACtvCK;EACE,qCAAA;CDyvCP;;ACvvCK;EACE,0BAAA;CD0vCP;;ACtwCK;EACE,qCAAA;CDywCP;;ACvwCK;EACE,0BAAA;CD0wCP;;ACtwCK;EACE,qCAAA;CDywCP;;ACvwCK;EACE,0BAAA;CD0wCP;;AC9wCK;EACE,qCAAA;CDixCP;;AC/wCK;EACE,0BAAA;CDkxCP;;ACtxCK;EACE,qCAAA;CDyxCP;;ACvxCK;EACE,0BAAA;CD0xCP;;AC9xCK;EACE,qCAAA;CDiyCP;;AC/xCK;EACE,0BAAA;CDkyCP;;ACtyCK;EACE,qCAAA;CDyyCP;;ACvyCK;EACE,0BAAA;CD0yCP;;AC9yCK;EACE,qCAAA;CDizCP;;AC/yCK;EACE,0BAAA;CDkzCP;;ACtzCK;EACE,qCAAA;CDyzCP;;ACvzCK;EACE,0BAAA;CD0zCP;;AC9zCK;EACE,qCAAA;CDi0CP;;AC/zCK;EACE,0BAAA;CDk0CP;;ACt0CK;EACE,qCAAA;CDy0CP;;ACv0CK;EACE,0BAAA;CD00CP;;AC90CK;EACE,qCAAA;CDi1CP;;AC/0CK;EACE,0BAAA;CDk1CP;;ACt1CK;EACE,qCAAA;CDy1CP;;ACv1CK;EACE,0BAAA;CD01CP;;AC91CK;EACE,qCAAA;CDi2CP;;AC/1CK;EACE,0BAAA;CDk2CP;;ACt2CK;EACE,qCAAA;CDy2CP;;ACv2CK;EACE,0BAAA;CD02CP;;ACt3CK;EACE,qCAAA;CDy3CP;;ACv3CK;EACE,0BAAA;CD03CP;;ACt3CK;EACE,qCAAA;CDy3CP;;ACv3CK;EACE,0BAAA;CD03CP;;AC93CK;EACE,qCAAA;CDi4CP;;AC/3CK;EACE,0BAAA;CDk4CP;;ACt4CK;EACE,qCAAA;CDy4CP;;ACv4CK;EACE,0BAAA;CD04CP;;AC94CK;EACE,qCAAA;CDi5CP;;AC/4CK;EACE,0BAAA;CDk5CP;;ACt5CK;EACE,qCAAA;CDy5CP;;ACv5CK;EACE,0BAAA;CD05CP;;AC95CK;EACE,qCAAA;CDi6CP;;AC/5CK;EACE,0BAAA;CDk6CP;;ACt6CK;EACE,qCAAA;CDy6CP;;ACv6CK;EACE,0BAAA;CD06CP;;AC96CK;EACE,qCAAA;CDi7CP;;AC/6CK;EACE,0BAAA;CDk7CP;;ACt7CK;EACE,qCAAA;CDy7CP;;ACv7CK;EACE,0BAAA;CD07CP;;AC97CK;EACE,qCAAA;CDi8CP;;AC/7CK;EACE,0BAAA;CDk8CP;;ACt8CK;EACE,qCAAA;CDy8CP;;ACv8CK;EACE,0BAAA;CD08CP;;AC98CK;EACE,qCAAA;CDi9CP;;AC/8CK;EACE,0BAAA;CDk9CP;;ACt9CK;EACE,qCAAA;CDy9CP;;ACv9CK;EACE,0BAAA;CD09CP;;ACt+CK;EACE,qCAAA;CDy+CP;;ACv+CK;EACE,0BAAA;CD0+CP;;ACt+CK;EACE,qCAAA;CDy+CP;;ACv+CK;EACE,0BAAA;CD0+CP;;AC9+CK;EACE,qCAAA;CDi/CP;;AC/+CK;EACE,0BAAA;CDk/CP;;ACt/CK;EACE,qCAAA;CDy/CP;;ACv/CK;EACE,0BAAA;CD0/CP;;AC9/CK;EACE,qCAAA;CDigDP;;AC//CK;EACE,0BAAA;CDkgDP;;ACtgDK;EACE,qCAAA;CDygDP;;ACvgDK;EACE,0BAAA;CD0gDP;;AC9gDK;EACE,qCAAA;CDihDP;;AC/gDK;EACE,0BAAA;CDkhDP;;ACthDK;EACE,qCAAA;CDyhDP;;ACvhDK;EACE,0BAAA;CD0hDP;;AC9hDK;EACE,qCAAA;CDiiDP;;AC/hDK;EACE,0BAAA;CDkiDP;;ACtiDK;EACE,qCAAA;CDyiDP;;ACviDK;EACE,0BAAA;CD0iDP;;ACtjDK;EACE,qCAAA;CDyjDP;;ACvjDK;EACE,0BAAA;CD0jDP;;ACtjDK;EACE,qCAAA;CDyjDP;;ACvjDK;EACE,0BAAA;CD0jDP;;AC9jDK;EACE,qCAAA;CDikDP;;AC/jDK;EACE,0BAAA;CDkkDP;;ACtkDK;EACE,qCAAA;CDykDP;;ACvkDK;EACE,0BAAA;CD0kDP;;AC9kDK;EACE,qCAAA;CDilDP;;AC/kDK;EACE,0BAAA;CDklDP;;ACtlDK;EACE,qCAAA;CDylDP;;ACvlDK;EACE,0BAAA;CD0lDP;;AC9lDK;EACE,qCAAA;CDimDP;;AC/lDK;EACE,0BAAA;CDkmDP;;ACtmDK;EACE,qCAAA;CDymDP;;ACvmDK;EACE,0BAAA;CD0mDP;;AC9mDK;EACE,qCAAA;CDinDP;;AC/mDK;EACE,0BAAA;CDknDP;;ACtnDK;EACE,qCAAA;CDynDP;;ACvnDK;EACE,0BAAA;CD0nDP;;ACtoDK;EACE,qCAAA;CDyoDP;;ACvoDK;EACE,0BAAA;CD0oDP;;ACtoDK;EACE,qCAAA;CDyoDP;;ACvoDK;EACE,0BAAA;CD0oDP;;AC9oDK;EACE,qCAAA;CDipDP;;AC/oDK;EACE,0BAAA;CDkpDP;;ACtpDK;EACE,qCAAA;CDypDP;;ACvpDK;EACE,0BAAA;CD0pDP;;AC9pDK;EACE,qCAAA;CDiqDP;;AC/pDK;EACE,0BAAA;CDkqDP;;ACtqDK;EACE,qCAAA;CDyqDP;;ACvqDK;EACE,0BAAA;CD0qDP;;AC9qDK;EACE,qCAAA;CDirDP;;AC/qDK;EACE,0BAAA;CDkrDP;;ACtrDK;EACE,qCAAA;CDyrDP;;ACvrDK;EACE,0BAAA;CD0rDP;;AC9rDK;EACE,qCAAA;CDisDP;;AC/rDK;EACE,0BAAA;CDksDP;;ACtsDK;EACE,qCAAA;CDysDP;;ACvsDK;EACE,0BAAA;CD0sDP;;AClsDC;EACE,qCAAA;CDqsDH;;ACnsDC;EACE,0BAAA;CDssDH;;AC1sDC;EACE,qCAAA;CD6sDH;;AC3sDC;EACE,0BAAA;CD8sDH;;ACltDC;EACE,yCAAA;CDqtDH;;ACntDC;EACE,8BAAA;CDstDH;;AE/lED,4EAAA;;AAEA;;;;GFqmEG;;AE/lEH;EACE,wBAAA;EAAyB,OAAA;EACzB,2BAAA;EAA4B,OAAA;EAC5B,+BAAA;EAAgC,OAAA;CFqmEjC;;AElmED;;GFsmEG;;AElmEH;EACE,UAAA;CFqmED;;AElmED;gFFqmEgF;;AElmEhF;;;;;GFymEG;;AElmEH;;;;;;;;;;;;;EAaE,eAAA;CFqmED;;AElmED;;;GFumEG;;AElmEH;;;;EAIE,sBAAA;EAAuB,OAAA;EACvB,yBAAA;EAA0B,OAAA;CFumE3B;;AEpmED;;;GFymEG;;AEpmEH;EACE,cAAA;EACA,UAAA;CFumED;;AEpmED;;;GFymEG;;AAniBH;;EE/jDE,cAAA;CFumED;;AEpmED;gFFumEgF;;AEpmEhF;;GFwmEG;;AEpmEH;EACE,8BAAA;CFumED;;AEpmED;;;GFymEG;;AEpmEH;;EAEE,WAAA;CFumED;;AEpmED;gFFumEgF;;AEpmEhF;;GFwmEG;;AEpmEH;EACE,0BAAA;CFumED;;AEpmED;;GFwmEG;;AEpmEH;;EAEE,kBAAA;CFumED;;AEpmED;;GFwmEG;;AEpmEH;EACE,mBAAA;CFumED;;AEpmED;;;GFymEG;;AEpmEH;EACE,eAAA;EACA,iBAAA;CFumED;;AEpmED;;GFwmEG;;AEpmEH;EACE,iBAAA;EACA,YAAA;CFumED;;AEpmED;;GFwmEG;;AEpmEH;EACE,eAAA;CFumED;;AEpmED;;GFwmEG;;AEpmEH;;EAEE,eAAA;EACA,eAAA;EACA,mBAAA;EACA,yBAAA;CFumED;;AEpmED;EACE,YAAA;CFumED;;AEpmED;EACE,gBAAA;CFumED;;AEpmED;gFFumEgF;;AEpm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","file":"main.scss","sourcesContent":["/** Import everything from autoload */\n;\n\n/**\n * Import npm dependencies\n *\n * Prefix your imports with `~` to grab from node_modules/\n * @see https://github.com/webpack-contrib/sass-loader#imports\n */\n// @import \"~some-node-module\";\n// Materialize\n@import \"~materialize-css/sass/components/color\";\n@import \"~materialize-css/sass/components/variables\";\n@import \"~materialize-css/sass/components/normalize\";\n@import \"~materialize-css/sass/components/global\";\n@import \"~materialize-css/sass/components/grid\";\n@import \"~materialize-css/sass/components/navbar\";\n@import \"~materialize-css/sass/components/typography\";\n@import \"~materialize-css/sass/components/buttons\";\n@import \"~materialize-css/sass/components/dropdown\";\n@import \"~materialize-css/sass/components/collapsible\";\n@import \"~materialize-css/sass/components/forms/forms\";\n\n/** Import theme styles */\n@import \"common/variables\";\n@import \"common/global\";\n@import \"common/typography\";\n@import \"common/a11y\";\n@import \"components/buttons\";\n@import \"components/comments\";\n@import \"components/forms\";\n@import \"components/wp-classes\";\n@import \"components/navigation\";\n@import \"components/unity\";\n@import \"components/socialicons\";\n@import \"layouts/header\";\n@import \"layouts/footer\";\n@import \"layouts/pages\";\n@import \"layouts/posts\";\n@import \"layouts/tinymce\";\n@import \"pages/home\";\n","/** Import everything from autoload */\n\n/**\n * Import npm dependencies\n *\n * Prefix your imports with `~` to grab from node_modules/\n * @see https://github.com/webpack-contrib/sass-loader#imports\n */\n\n.materialize-red {\n  background-color: #e51c23 !important;\n}\n\n.materialize-red-text {\n  color: #e51c23 !important;\n}\n\n.materialize-red.lighten-5 {\n  background-color: #fdeaeb !important;\n}\n\n.materialize-red-text.text-lighten-5 {\n  color: #fdeaeb !important;\n}\n\n.materialize-red.lighten-4 {\n  background-color: #f8c1c3 !important;\n}\n\n.materialize-red-text.text-lighten-4 {\n  color: #f8c1c3 !important;\n}\n\n.materialize-red.lighten-3 {\n  background-color: #f3989b !important;\n}\n\n.materialize-red-text.text-lighten-3 {\n  color: #f3989b !important;\n}\n\n.materialize-red.lighten-2 {\n  background-color: #ee6e73 !important;\n}\n\n.materialize-red-text.text-lighten-2 {\n  color: #ee6e73 !important;\n}\n\n.materialize-red.lighten-1 {\n  background-color: #ea454b !important;\n}\n\n.materialize-red-text.text-lighten-1 {\n  color: #ea454b !important;\n}\n\n.materialize-red.darken-1 {\n  background-color: #d0181e !important;\n}\n\n.materialize-red-text.text-darken-1 {\n  color: #d0181e !important;\n}\n\n.materialize-red.darken-2 {\n  background-color: #b9151b !important;\n}\n\n.materialize-red-text.text-darken-2 {\n  color: #b9151b !important;\n}\n\n.materialize-red.darken-3 {\n  background-color: #a21318 !important;\n}\n\n.materialize-red-text.text-darken-3 {\n  color: #a21318 !important;\n}\n\n.materialize-red.darken-4 {\n  background-color: #8b1014 !important;\n}\n\n.materialize-red-text.text-darken-4 {\n  color: #8b1014 !important;\n}\n\n.red {\n  background-color: #F44336 !important;\n}\n\n.red-text {\n  color: #F44336 !important;\n}\n\n.red.lighten-5 {\n  background-color: #FFEBEE !important;\n}\n\n.red-text.text-lighten-5 {\n  color: #FFEBEE !important;\n}\n\n.red.lighten-4 {\n  background-color: #FFCDD2 !important;\n}\n\n.red-text.text-lighten-4 {\n  color: #FFCDD2 !important;\n}\n\n.red.lighten-3 {\n  background-color: #EF9A9A !important;\n}\n\n.red-text.text-lighten-3 {\n  color: #EF9A9A !important;\n}\n\n.red.lighten-2 {\n  background-color: #E57373 !important;\n}\n\n.red-text.text-lighten-2 {\n  color: #E57373 !important;\n}\n\n.red.lighten-1 {\n  background-color: #EF5350 !important;\n}\n\n.red-text.text-lighten-1 {\n  color: #EF5350 !important;\n}\n\n.red.darken-1 {\n  background-color: #E53935 !important;\n}\n\n.red-text.text-darken-1 {\n  color: #E53935 !important;\n}\n\n.red.darken-2 {\n  background-color: #D32F2F !important;\n}\n\n.red-text.text-darken-2 {\n  color: #D32F2F !important;\n}\n\n.red.darken-3 {\n  background-color: #C62828 !important;\n}\n\n.red-text.text-darken-3 {\n  color: #C62828 !important;\n}\n\n.red.darken-4 {\n  background-color: #B71C1C !important;\n}\n\n.red-text.text-darken-4 {\n  color: #B71C1C !important;\n}\n\n.red.accent-1 {\n  background-color: #FF8A80 !important;\n}\n\n.red-text.text-accent-1 {\n  color: #FF8A80 !important;\n}\n\n.red.accent-2 {\n  background-color: #FF5252 !important;\n}\n\n.red-text.text-accent-2 {\n  color: #FF5252 !important;\n}\n\n.red.accent-3 {\n  background-color: #FF1744 !important;\n}\n\n.red-text.text-accent-3 {\n  color: #FF1744 !important;\n}\n\n.red.accent-4 {\n  background-color: #D50000 !important;\n}\n\n.red-text.text-accent-4 {\n  color: #D50000 !important;\n}\n\n.pink {\n  background-color: #e91e63 !important;\n}\n\n.pink-text {\n  color: #e91e63 !important;\n}\n\n.pink.lighten-5 {\n  background-color: #fce4ec !important;\n}\n\n.pink-text.text-lighten-5 {\n  color: #fce4ec !important;\n}\n\n.pink.lighten-4 {\n  background-color: #f8bbd0 !important;\n}\n\n.pink-text.text-lighten-4 {\n  color: #f8bbd0 !important;\n}\n\n.pink.lighten-3 {\n  background-color: #f48fb1 !important;\n}\n\n.pink-text.text-lighten-3 {\n  color: #f48fb1 !important;\n}\n\n.pink.lighten-2 {\n  background-color: #f06292 !important;\n}\n\n.pink-text.text-lighten-2 {\n  color: #f06292 !important;\n}\n\n.pink.lighten-1 {\n  background-color: #ec407a !important;\n}\n\n.pink-text.text-lighten-1 {\n  color: #ec407a !important;\n}\n\n.pink.darken-1 {\n  background-color: #d81b60 !important;\n}\n\n.pink-text.text-darken-1 {\n  color: #d81b60 !important;\n}\n\n.pink.darken-2 {\n  background-color: #c2185b !important;\n}\n\n.pink-text.text-darken-2 {\n  color: #c2185b !important;\n}\n\n.pink.darken-3 {\n  background-color: #ad1457 !important;\n}\n\n.pink-text.text-darken-3 {\n  color: #ad1457 !important;\n}\n\n.pink.darken-4 {\n  background-color: #880e4f !important;\n}\n\n.pink-text.text-darken-4 {\n  color: #880e4f !important;\n}\n\n.pink.accent-1 {\n  background-color: #ff80ab !important;\n}\n\n.pink-text.text-accent-1 {\n  color: #ff80ab !important;\n}\n\n.pink.accent-2 {\n  background-color: #ff4081 !important;\n}\n\n.pink-text.text-accent-2 {\n  color: #ff4081 !important;\n}\n\n.pink.accent-3 {\n  background-color: #f50057 !important;\n}\n\n.pink-text.text-accent-3 {\n  color: #f50057 !important;\n}\n\n.pink.accent-4 {\n  background-color: #c51162 !important;\n}\n\n.pink-text.text-accent-4 {\n  color: #c51162 !important;\n}\n\n.purple {\n  background-color: #9c27b0 !important;\n}\n\n.purple-text {\n  color: #9c27b0 !important;\n}\n\n.purple.lighten-5 {\n  background-color: #f3e5f5 !important;\n}\n\n.purple-text.text-lighten-5 {\n  color: #f3e5f5 !important;\n}\n\n.purple.lighten-4 {\n  background-color: #e1bee7 !important;\n}\n\n.purple-text.text-lighten-4 {\n  color: #e1bee7 !important;\n}\n\n.purple.lighten-3 {\n  background-color: #ce93d8 !important;\n}\n\n.purple-text.text-lighten-3 {\n  color: #ce93d8 !important;\n}\n\n.purple.lighten-2 {\n  background-color: #ba68c8 !important;\n}\n\n.purple-text.text-lighten-2 {\n  color: #ba68c8 !important;\n}\n\n.purple.lighten-1 {\n  background-color: #ab47bc !important;\n}\n\n.purple-text.text-lighten-1 {\n  color: #ab47bc !important;\n}\n\n.purple.darken-1 {\n  background-color: #8e24aa !important;\n}\n\n.purple-text.text-darken-1 {\n  color: #8e24aa !important;\n}\n\n.purple.darken-2 {\n  background-color: #7b1fa2 !important;\n}\n\n.purple-text.text-darken-2 {\n  color: #7b1fa2 !important;\n}\n\n.purple.darken-3 {\n  background-color: #6a1b9a !important;\n}\n\n.purple-text.text-darken-3 {\n  color: #6a1b9a !important;\n}\n\n.purple.darken-4 {\n  background-color: #4a148c !important;\n}\n\n.purple-text.text-darken-4 {\n  color: #4a148c !important;\n}\n\n.purple.accent-1 {\n  background-color: #ea80fc !important;\n}\n\n.purple-text.text-accent-1 {\n  color: #ea80fc !important;\n}\n\n.purple.accent-2 {\n  background-color: #e040fb !important;\n}\n\n.purple-text.text-accent-2 {\n  color: #e040fb !important;\n}\n\n.purple.accent-3 {\n  background-color: #d500f9 !important;\n}\n\n.purple-text.text-accent-3 {\n  color: #d500f9 !important;\n}\n\n.purple.accent-4 {\n  background-color: #aa00ff !important;\n}\n\n.purple-text.text-accent-4 {\n  color: #aa00ff !important;\n}\n\n.deep-purple {\n  background-color: #673ab7 !important;\n}\n\n.deep-purple-text {\n  color: #673ab7 !important;\n}\n\n.deep-purple.lighten-5 {\n  background-color: #ede7f6 !important;\n}\n\n.deep-purple-text.text-lighten-5 {\n  color: #ede7f6 !important;\n}\n\n.deep-purple.lighten-4 {\n  background-color: #d1c4e9 !important;\n}\n\n.deep-purple-text.text-lighten-4 {\n  color: #d1c4e9 !important;\n}\n\n.deep-purple.lighten-3 {\n  background-color: #b39ddb !important;\n}\n\n.deep-purple-text.text-lighten-3 {\n  color: #b39ddb !important;\n}\n\n.deep-purple.lighten-2 {\n  background-color: #9575cd !important;\n}\n\n.deep-purple-text.text-lighten-2 {\n  color: #9575cd !important;\n}\n\n.deep-purple.lighten-1 {\n  background-color: #7e57c2 !important;\n}\n\n.deep-purple-text.text-lighten-1 {\n  color: #7e57c2 !important;\n}\n\n.deep-purple.darken-1 {\n  background-color: #5e35b1 !important;\n}\n\n.deep-purple-text.text-darken-1 {\n  color: #5e35b1 !important;\n}\n\n.deep-purple.darken-2 {\n  background-color: #512da8 !important;\n}\n\n.deep-purple-text.text-darken-2 {\n  color: #512da8 !important;\n}\n\n.deep-purple.darken-3 {\n  background-color: #4527a0 !important;\n}\n\n.deep-purple-text.text-darken-3 {\n  color: #4527a0 !important;\n}\n\n.deep-purple.darken-4 {\n  background-color: #311b92 !important;\n}\n\n.deep-purple-text.text-darken-4 {\n  color: #311b92 !important;\n}\n\n.deep-purple.accent-1 {\n  background-color: #b388ff !important;\n}\n\n.deep-purple-text.text-accent-1 {\n  color: #b388ff !important;\n}\n\n.deep-purple.accent-2 {\n  background-color: #7c4dff !important;\n}\n\n.deep-purple-text.text-accent-2 {\n  color: #7c4dff !important;\n}\n\n.deep-purple.accent-3 {\n  background-color: #651fff !important;\n}\n\n.deep-purple-text.text-accent-3 {\n  color: #651fff !important;\n}\n\n.deep-purple.accent-4 {\n  background-color: #6200ea !important;\n}\n\n.deep-purple-text.text-accent-4 {\n  color: #6200ea !important;\n}\n\n.indigo {\n  background-color: #3f51b5 !important;\n}\n\n.indigo-text {\n  color: #3f51b5 !important;\n}\n\n.indigo.lighten-5 {\n  background-color: #e8eaf6 !important;\n}\n\n.indigo-text.text-lighten-5 {\n  color: #e8eaf6 !important;\n}\n\n.indigo.lighten-4 {\n  background-color: #c5cae9 !important;\n}\n\n.indigo-text.text-lighten-4 {\n  color: #c5cae9 !important;\n}\n\n.indigo.lighten-3 {\n  background-color: #9fa8da !important;\n}\n\n.indigo-text.text-lighten-3 {\n  color: #9fa8da !important;\n}\n\n.indigo.lighten-2 {\n  background-color: #7986cb !important;\n}\n\n.indigo-text.text-lighten-2 {\n  color: #7986cb !important;\n}\n\n.indigo.lighten-1 {\n  background-color: #5c6bc0 !important;\n}\n\n.indigo-text.text-lighten-1 {\n  color: #5c6bc0 !important;\n}\n\n.indigo.darken-1 {\n  background-color: #3949ab !important;\n}\n\n.indigo-text.text-darken-1 {\n  color: #3949ab !important;\n}\n\n.indigo.darken-2 {\n  background-color: #303f9f !important;\n}\n\n.indigo-text.text-darken-2 {\n  color: #303f9f !important;\n}\n\n.indigo.darken-3 {\n  background-color: #283593 !important;\n}\n\n.indigo-text.text-darken-3 {\n  color: #283593 !important;\n}\n\n.indigo.darken-4 {\n  background-color: #1a237e !important;\n}\n\n.indigo-text.text-darken-4 {\n  color: #1a237e !important;\n}\n\n.indigo.accent-1 {\n  background-color: #8c9eff !important;\n}\n\n.indigo-text.text-accent-1 {\n  color: #8c9eff !important;\n}\n\n.indigo.accent-2 {\n  background-color: #536dfe !important;\n}\n\n.indigo-text.text-accent-2 {\n  color: #536dfe !important;\n}\n\n.indigo.accent-3 {\n  background-color: #3d5afe !important;\n}\n\n.indigo-text.text-accent-3 {\n  color: #3d5afe !important;\n}\n\n.indigo.accent-4 {\n  background-color: #304ffe !important;\n}\n\n.indigo-text.text-accent-4 {\n  color: #304ffe !important;\n}\n\n.blue {\n  background-color: #2196F3 !important;\n}\n\n.blue-text {\n  color: #2196F3 !important;\n}\n\n.blue.lighten-5 {\n  background-color: #E3F2FD !important;\n}\n\n.blue-text.text-lighten-5 {\n  color: #E3F2FD !important;\n}\n\n.blue.lighten-4 {\n  background-color: #BBDEFB !important;\n}\n\n.blue-text.text-lighten-4 {\n  color: #BBDEFB !important;\n}\n\n.blue.lighten-3 {\n  background-color: #90CAF9 !important;\n}\n\n.blue-text.text-lighten-3 {\n  color: #90CAF9 !important;\n}\n\n.blue.lighten-2 {\n  background-color: #64B5F6 !important;\n}\n\n.blue-text.text-lighten-2 {\n  color: #64B5F6 !important;\n}\n\n.blue.lighten-1 {\n  background-color: #42A5F5 !important;\n}\n\n.blue-text.text-lighten-1 {\n  color: #42A5F5 !important;\n}\n\n.blue.darken-1 {\n  background-color: #1E88E5 !important;\n}\n\n.blue-text.text-darken-1 {\n  color: #1E88E5 !important;\n}\n\n.blue.darken-2 {\n  background-color: #1976D2 !important;\n}\n\n.blue-text.text-darken-2 {\n  color: #1976D2 !important;\n}\n\n.blue.darken-3 {\n  background-color: #1565C0 !important;\n}\n\n.blue-text.text-darken-3 {\n  color: #1565C0 !important;\n}\n\n.blue.darken-4 {\n  background-color: #0D47A1 !important;\n}\n\n.blue-text.text-darken-4 {\n  color: #0D47A1 !important;\n}\n\n.blue.accent-1 {\n  background-color: #82B1FF !important;\n}\n\n.blue-text.text-accent-1 {\n  color: #82B1FF !important;\n}\n\n.blue.accent-2 {\n  background-color: #448AFF !important;\n}\n\n.blue-text.text-accent-2 {\n  color: #448AFF !important;\n}\n\n.blue.accent-3 {\n  background-color: #2979FF !important;\n}\n\n.blue-text.text-accent-3 {\n  color: #2979FF !important;\n}\n\n.blue.accent-4 {\n  background-color: #2962FF !important;\n}\n\n.blue-text.text-accent-4 {\n  color: #2962FF !important;\n}\n\n.light-blue {\n  background-color: #03a9f4 !important;\n}\n\n.light-blue-text {\n  color: #03a9f4 !important;\n}\n\n.light-blue.lighten-5 {\n  background-color: #e1f5fe !important;\n}\n\n.light-blue-text.text-lighten-5 {\n  color: #e1f5fe !important;\n}\n\n.light-blue.lighten-4 {\n  background-color: #b3e5fc !important;\n}\n\n.light-blue-text.text-lighten-4 {\n  color: #b3e5fc !important;\n}\n\n.light-blue.lighten-3 {\n  background-color: #81d4fa !important;\n}\n\n.light-blue-text.text-lighten-3 {\n  color: #81d4fa !important;\n}\n\n.light-blue.lighten-2 {\n  background-color: #4fc3f7 !important;\n}\n\n.light-blue-text.text-lighten-2 {\n  color: #4fc3f7 !important;\n}\n\n.light-blue.lighten-1 {\n  background-color: #29b6f6 !important;\n}\n\n.light-blue-text.text-lighten-1 {\n  color: #29b6f6 !important;\n}\n\n.light-blue.darken-1 {\n  background-color: #039be5 !important;\n}\n\n.light-blue-text.text-darken-1 {\n  color: #039be5 !important;\n}\n\n.light-blue.darken-2 {\n  background-color: #0288d1 !important;\n}\n\n.light-blue-text.text-darken-2 {\n  color: #0288d1 !important;\n}\n\n.light-blue.darken-3 {\n  background-color: #0277bd !important;\n}\n\n.light-blue-text.text-darken-3 {\n  color: #0277bd !important;\n}\n\n.light-blue.darken-4 {\n  background-color: #01579b !important;\n}\n\n.light-blue-text.text-darken-4 {\n  color: #01579b !important;\n}\n\n.light-blue.accent-1 {\n  background-color: #80d8ff !important;\n}\n\n.light-blue-text.text-accent-1 {\n  color: #80d8ff !important;\n}\n\n.light-blue.accent-2 {\n  background-color: #40c4ff !important;\n}\n\n.light-blue-text.text-accent-2 {\n  color: #40c4ff !important;\n}\n\n.light-blue.accent-3 {\n  background-color: #00b0ff !important;\n}\n\n.light-blue-text.text-accent-3 {\n  color: #00b0ff !important;\n}\n\n.light-blue.accent-4 {\n  background-color: #0091ea !important;\n}\n\n.light-blue-text.text-accent-4 {\n  color: #0091ea !important;\n}\n\n.cyan {\n  background-color: #00bcd4 !important;\n}\n\n.cyan-text {\n  color: #00bcd4 !important;\n}\n\n.cyan.lighten-5 {\n  background-color: #e0f7fa !important;\n}\n\n.cyan-text.text-lighten-5 {\n  color: #e0f7fa !important;\n}\n\n.cyan.lighten-4 {\n  background-color: #b2ebf2 !important;\n}\n\n.cyan-text.text-lighten-4 {\n  color: #b2ebf2 !important;\n}\n\n.cyan.lighten-3 {\n  background-color: #80deea !important;\n}\n\n.cyan-text.text-lighten-3 {\n  color: #80deea !important;\n}\n\n.cyan.lighten-2 {\n  background-color: #4dd0e1 !important;\n}\n\n.cyan-text.text-lighten-2 {\n  color: #4dd0e1 !important;\n}\n\n.cyan.lighten-1 {\n  background-color: #26c6da !important;\n}\n\n.cyan-text.text-lighten-1 {\n  color: #26c6da !important;\n}\n\n.cyan.darken-1 {\n  background-color: #00acc1 !important;\n}\n\n.cyan-text.text-darken-1 {\n  color: #00acc1 !important;\n}\n\n.cyan.darken-2 {\n  background-color: #0097a7 !important;\n}\n\n.cyan-text.text-darken-2 {\n  color: #0097a7 !important;\n}\n\n.cyan.darken-3 {\n  background-color: #00838f !important;\n}\n\n.cyan-text.text-darken-3 {\n  color: #00838f !important;\n}\n\n.cyan.darken-4 {\n  background-color: #006064 !important;\n}\n\n.cyan-text.text-darken-4 {\n  color: #006064 !important;\n}\n\n.cyan.accent-1 {\n  background-color: #84ffff !important;\n}\n\n.cyan-text.text-accent-1 {\n  color: #84ffff !important;\n}\n\n.cyan.accent-2 {\n  background-color: #18ffff !important;\n}\n\n.cyan-text.text-accent-2 {\n  color: #18ffff !important;\n}\n\n.cyan.accent-3 {\n  background-color: #00e5ff !important;\n}\n\n.cyan-text.text-accent-3 {\n  color: #00e5ff !important;\n}\n\n.cyan.accent-4 {\n  background-color: #00b8d4 !important;\n}\n\n.cyan-text.text-accent-4 {\n  color: #00b8d4 !important;\n}\n\n.teal {\n  background-color: #009688 !important;\n}\n\n.teal-text {\n  color: #009688 !important;\n}\n\n.teal.lighten-5 {\n  background-color: #e0f2f1 !important;\n}\n\n.teal-text.text-lighten-5 {\n  color: #e0f2f1 !important;\n}\n\n.teal.lighten-4 {\n  background-color: #b2dfdb !important;\n}\n\n.teal-text.text-lighten-4 {\n  color: #b2dfdb !important;\n}\n\n.teal.lighten-3 {\n  background-color: #80cbc4 !important;\n}\n\n.teal-text.text-lighten-3 {\n  color: #80cbc4 !important;\n}\n\n.teal.lighten-2 {\n  background-color: #4db6ac !important;\n}\n\n.teal-text.text-lighten-2 {\n  color: #4db6ac !important;\n}\n\n.teal.lighten-1 {\n  background-color: #26a69a !important;\n}\n\n.teal-text.text-lighten-1 {\n  color: #26a69a !important;\n}\n\n.teal.darken-1 {\n  background-color: #00897b !important;\n}\n\n.teal-text.text-darken-1 {\n  color: #00897b !important;\n}\n\n.teal.darken-2 {\n  background-color: #00796b !important;\n}\n\n.teal-text.text-darken-2 {\n  color: #00796b !important;\n}\n\n.teal.darken-3 {\n  background-color: #00695c !important;\n}\n\n.teal-text.text-darken-3 {\n  color: #00695c !important;\n}\n\n.teal.darken-4 {\n  background-color: #004d40 !important;\n}\n\n.teal-text.text-darken-4 {\n  color: #004d40 !important;\n}\n\n.teal.accent-1 {\n  background-color: #a7ffeb !important;\n}\n\n.teal-text.text-accent-1 {\n  color: #a7ffeb !important;\n}\n\n.teal.accent-2 {\n  background-color: #64ffda !important;\n}\n\n.teal-text.text-accent-2 {\n  color: #64ffda !important;\n}\n\n.teal.accent-3 {\n  background-color: #1de9b6 !important;\n}\n\n.teal-text.text-accent-3 {\n  color: #1de9b6 !important;\n}\n\n.teal.accent-4 {\n  background-color: #00bfa5 !important;\n}\n\n.teal-text.text-accent-4 {\n  color: #00bfa5 !important;\n}\n\n.green {\n  background-color: #4CAF50 !important;\n}\n\n.green-text {\n  color: #4CAF50 !important;\n}\n\n.green.lighten-5 {\n  background-color: #E8F5E9 !important;\n}\n\n.green-text.text-lighten-5 {\n  color: #E8F5E9 !important;\n}\n\n.green.lighten-4 {\n  background-color: #C8E6C9 !important;\n}\n\n.green-text.text-lighten-4 {\n  color: #C8E6C9 !important;\n}\n\n.green.lighten-3 {\n  background-color: #A5D6A7 !important;\n}\n\n.green-text.text-lighten-3 {\n  color: #A5D6A7 !important;\n}\n\n.green.lighten-2 {\n  background-color: #81C784 !important;\n}\n\n.green-text.text-lighten-2 {\n  color: #81C784 !important;\n}\n\n.green.lighten-1 {\n  background-color: #66BB6A !important;\n}\n\n.green-text.text-lighten-1 {\n  color: #66BB6A !important;\n}\n\n.green.darken-1 {\n  background-color: #43A047 !important;\n}\n\n.green-text.text-darken-1 {\n  color: #43A047 !important;\n}\n\n.green.darken-2 {\n  background-color: #388E3C !important;\n}\n\n.green-text.text-darken-2 {\n  color: #388E3C !important;\n}\n\n.green.darken-3 {\n  background-color: #2E7D32 !important;\n}\n\n.green-text.text-darken-3 {\n  color: #2E7D32 !important;\n}\n\n.green.darken-4 {\n  background-color: #1B5E20 !important;\n}\n\n.green-text.text-darken-4 {\n  color: #1B5E20 !important;\n}\n\n.green.accent-1 {\n  background-color: #B9F6CA !important;\n}\n\n.green-text.text-accent-1 {\n  color: #B9F6CA !important;\n}\n\n.green.accent-2 {\n  background-color: #69F0AE !important;\n}\n\n.green-text.text-accent-2 {\n  color: #69F0AE !important;\n}\n\n.green.accent-3 {\n  background-color: #00E676 !important;\n}\n\n.green-text.text-accent-3 {\n  color: #00E676 !important;\n}\n\n.green.accent-4 {\n  background-color: #00C853 !important;\n}\n\n.green-text.text-accent-4 {\n  color: #00C853 !important;\n}\n\n.light-green {\n  background-color: #8bc34a !important;\n}\n\n.light-green-text {\n  color: #8bc34a !important;\n}\n\n.light-green.lighten-5 {\n  background-color: #f1f8e9 !important;\n}\n\n.light-green-text.text-lighten-5 {\n  color: #f1f8e9 !important;\n}\n\n.light-green.lighten-4 {\n  background-color: #dcedc8 !important;\n}\n\n.light-green-text.text-lighten-4 {\n  color: #dcedc8 !important;\n}\n\n.light-green.lighten-3 {\n  background-color: #c5e1a5 !important;\n}\n\n.light-green-text.text-lighten-3 {\n  color: #c5e1a5 !important;\n}\n\n.light-green.lighten-2 {\n  background-color: #aed581 !important;\n}\n\n.light-green-text.text-lighten-2 {\n  color: #aed581 !important;\n}\n\n.light-green.lighten-1 {\n  background-color: #9ccc65 !important;\n}\n\n.light-green-text.text-lighten-1 {\n  color: #9ccc65 !important;\n}\n\n.light-green.darken-1 {\n  background-color: #7cb342 !important;\n}\n\n.light-green-text.text-darken-1 {\n  color: #7cb342 !important;\n}\n\n.light-green.darken-2 {\n  background-color: #689f38 !important;\n}\n\n.light-green-text.text-darken-2 {\n  color: #689f38 !important;\n}\n\n.light-green.darken-3 {\n  background-color: #558b2f !important;\n}\n\n.light-green-text.text-darken-3 {\n  color: #558b2f !important;\n}\n\n.light-green.darken-4 {\n  background-color: #33691e !important;\n}\n\n.light-green-text.text-darken-4 {\n  color: #33691e !important;\n}\n\n.light-green.accent-1 {\n  background-color: #ccff90 !important;\n}\n\n.light-green-text.text-accent-1 {\n  color: #ccff90 !important;\n}\n\n.light-green.accent-2 {\n  background-color: #b2ff59 !important;\n}\n\n.light-green-text.text-accent-2 {\n  color: #b2ff59 !important;\n}\n\n.light-green.accent-3 {\n  background-color: #76ff03 !important;\n}\n\n.light-green-text.text-accent-3 {\n  color: #76ff03 !important;\n}\n\n.light-green.accent-4 {\n  background-color: #64dd17 !important;\n}\n\n.light-green-text.text-accent-4 {\n  color: #64dd17 !important;\n}\n\n.lime {\n  background-color: #cddc39 !important;\n}\n\n.lime-text {\n  color: #cddc39 !important;\n}\n\n.lime.lighten-5 {\n  background-color: #f9fbe7 !important;\n}\n\n.lime-text.text-lighten-5 {\n  color: #f9fbe7 !important;\n}\n\n.lime.lighten-4 {\n  background-color: #f0f4c3 !important;\n}\n\n.lime-text.text-lighten-4 {\n  color: #f0f4c3 !important;\n}\n\n.lime.lighten-3 {\n  background-color: #e6ee9c !important;\n}\n\n.lime-text.text-lighten-3 {\n  color: #e6ee9c !important;\n}\n\n.lime.lighten-2 {\n  background-color: #dce775 !important;\n}\n\n.lime-text.text-lighten-2 {\n  color: #dce775 !important;\n}\n\n.lime.lighten-1 {\n  background-color: #d4e157 !important;\n}\n\n.lime-text.text-lighten-1 {\n  color: #d4e157 !important;\n}\n\n.lime.darken-1 {\n  background-color: #c0ca33 !important;\n}\n\n.lime-text.text-darken-1 {\n  color: #c0ca33 !important;\n}\n\n.lime.darken-2 {\n  background-color: #afb42b !important;\n}\n\n.lime-text.text-darken-2 {\n  color: #afb42b !important;\n}\n\n.lime.darken-3 {\n  background-color: #9e9d24 !important;\n}\n\n.lime-text.text-darken-3 {\n  color: #9e9d24 !important;\n}\n\n.lime.darken-4 {\n  background-color: #827717 !important;\n}\n\n.lime-text.text-darken-4 {\n  color: #827717 !important;\n}\n\n.lime.accent-1 {\n  background-color: #f4ff81 !important;\n}\n\n.lime-text.text-accent-1 {\n  color: #f4ff81 !important;\n}\n\n.lime.accent-2 {\n  background-color: #eeff41 !important;\n}\n\n.lime-text.text-accent-2 {\n  color: #eeff41 !important;\n}\n\n.lime.accent-3 {\n  background-color: #c6ff00 !important;\n}\n\n.lime-text.text-accent-3 {\n  color: #c6ff00 !important;\n}\n\n.lime.accent-4 {\n  background-color: #aeea00 !important;\n}\n\n.lime-text.text-accent-4 {\n  color: #aeea00 !important;\n}\n\n.yellow {\n  background-color: #ffeb3b !important;\n}\n\n.yellow-text {\n  color: #ffeb3b !important;\n}\n\n.yellow.lighten-5 {\n  background-color: #fffde7 !important;\n}\n\n.yellow-text.text-lighten-5 {\n  color: #fffde7 !important;\n}\n\n.yellow.lighten-4 {\n  background-color: #fff9c4 !important;\n}\n\n.yellow-text.text-lighten-4 {\n  color: #fff9c4 !important;\n}\n\n.yellow.lighten-3 {\n  background-color: #fff59d !important;\n}\n\n.yellow-text.text-lighten-3 {\n  color: #fff59d !important;\n}\n\n.yellow.lighten-2 {\n  background-color: #fff176 !important;\n}\n\n.yellow-text.text-lighten-2 {\n  color: #fff176 !important;\n}\n\n.yellow.lighten-1 {\n  background-color: #ffee58 !important;\n}\n\n.yellow-text.text-lighten-1 {\n  color: #ffee58 !important;\n}\n\n.yellow.darken-1 {\n  background-color: #fdd835 !important;\n}\n\n.yellow-text.text-darken-1 {\n  color: #fdd835 !important;\n}\n\n.yellow.darken-2 {\n  background-color: #fbc02d !important;\n}\n\n.yellow-text.text-darken-2 {\n  color: #fbc02d !important;\n}\n\n.yellow.darken-3 {\n  background-color: #f9a825 !important;\n}\n\n.yellow-text.text-darken-3 {\n  color: #f9a825 !important;\n}\n\n.yellow.darken-4 {\n  background-color: #f57f17 !important;\n}\n\n.yellow-text.text-darken-4 {\n  color: #f57f17 !important;\n}\n\n.yellow.accent-1 {\n  background-color: #ffff8d !important;\n}\n\n.yellow-text.text-accent-1 {\n  color: #ffff8d !important;\n}\n\n.yellow.accent-2 {\n  background-color: #ffff00 !important;\n}\n\n.yellow-text.text-accent-2 {\n  color: #ffff00 !important;\n}\n\n.yellow.accent-3 {\n  background-color: #ffea00 !important;\n}\n\n.yellow-text.text-accent-3 {\n  color: #ffea00 !important;\n}\n\n.yellow.accent-4 {\n  background-color: #ffd600 !important;\n}\n\n.yellow-text.text-accent-4 {\n  color: #ffd600 !important;\n}\n\n.amber {\n  background-color: #ffc107 !important;\n}\n\n.amber-text {\n  color: #ffc107 !important;\n}\n\n.amber.lighten-5 {\n  background-color: #fff8e1 !important;\n}\n\n.amber-text.text-lighten-5 {\n  color: #fff8e1 !important;\n}\n\n.amber.lighten-4 {\n  background-color: #ffecb3 !important;\n}\n\n.amber-text.text-lighten-4 {\n  color: #ffecb3 !important;\n}\n\n.amber.lighten-3 {\n  background-color: #ffe082 !important;\n}\n\n.amber-text.text-lighten-3 {\n  color: #ffe082 !important;\n}\n\n.amber.lighten-2 {\n  background-color: #ffd54f !important;\n}\n\n.amber-text.text-lighten-2 {\n  color: #ffd54f !important;\n}\n\n.amber.lighten-1 {\n  background-color: #ffca28 !important;\n}\n\n.amber-text.text-lighten-1 {\n  color: #ffca28 !important;\n}\n\n.amber.darken-1 {\n  background-color: #ffb300 !important;\n}\n\n.amber-text.text-darken-1 {\n  color: #ffb300 !important;\n}\n\n.amber.darken-2 {\n  background-color: #ffa000 !important;\n}\n\n.amber-text.text-darken-2 {\n  color: #ffa000 !important;\n}\n\n.amber.darken-3 {\n  background-color: #ff8f00 !important;\n}\n\n.amber-text.text-darken-3 {\n  color: #ff8f00 !important;\n}\n\n.amber.darken-4 {\n  background-color: #ff6f00 !important;\n}\n\n.amber-text.text-darken-4 {\n  color: #ff6f00 !important;\n}\n\n.amber.accent-1 {\n  background-color: #ffe57f !important;\n}\n\n.amber-text.text-accent-1 {\n  color: #ffe57f !important;\n}\n\n.amber.accent-2 {\n  background-color: #ffd740 !important;\n}\n\n.amber-text.text-accent-2 {\n  color: #ffd740 !important;\n}\n\n.amber.accent-3 {\n  background-color: #ffc400 !important;\n}\n\n.amber-text.text-accent-3 {\n  color: #ffc400 !important;\n}\n\n.amber.accent-4 {\n  background-color: #ffab00 !important;\n}\n\n.amber-text.text-accent-4 {\n  color: #ffab00 !important;\n}\n\n.orange {\n  background-color: #ff9800 !important;\n}\n\n.orange-text {\n  color: #ff9800 !important;\n}\n\n.orange.lighten-5 {\n  background-color: #fff3e0 !important;\n}\n\n.orange-text.text-lighten-5 {\n  color: #fff3e0 !important;\n}\n\n.orange.lighten-4 {\n  background-color: #ffe0b2 !important;\n}\n\n.orange-text.text-lighten-4 {\n  color: #ffe0b2 !important;\n}\n\n.orange.lighten-3 {\n  background-color: #ffcc80 !important;\n}\n\n.orange-text.text-lighten-3 {\n  color: #ffcc80 !important;\n}\n\n.orange.lighten-2 {\n  background-color: #ffb74d !important;\n}\n\n.orange-text.text-lighten-2 {\n  color: #ffb74d !important;\n}\n\n.orange.lighten-1 {\n  background-color: #ffa726 !important;\n}\n\n.orange-text.text-lighten-1 {\n  color: #ffa726 !important;\n}\n\n.orange.darken-1 {\n  background-color: #fb8c00 !important;\n}\n\n.orange-text.text-darken-1 {\n  color: #fb8c00 !important;\n}\n\n.orange.darken-2 {\n  background-color: #f57c00 !important;\n}\n\n.orange-text.text-darken-2 {\n  color: #f57c00 !important;\n}\n\n.orange.darken-3 {\n  background-color: #ef6c00 !important;\n}\n\n.orange-text.text-darken-3 {\n  color: #ef6c00 !important;\n}\n\n.orange.darken-4 {\n  background-color: #e65100 !important;\n}\n\n.orange-text.text-darken-4 {\n  color: #e65100 !important;\n}\n\n.orange.accent-1 {\n  background-color: #ffd180 !important;\n}\n\n.orange-text.text-accent-1 {\n  color: #ffd180 !important;\n}\n\n.orange.accent-2 {\n  background-color: #ffab40 !important;\n}\n\n.orange-text.text-accent-2 {\n  color: #ffab40 !important;\n}\n\n.orange.accent-3 {\n  background-color: #ff9100 !important;\n}\n\n.orange-text.text-accent-3 {\n  color: #ff9100 !important;\n}\n\n.orange.accent-4 {\n  background-color: #ff6d00 !important;\n}\n\n.orange-text.text-accent-4 {\n  color: #ff6d00 !important;\n}\n\n.deep-orange {\n  background-color: #ff5722 !important;\n}\n\n.deep-orange-text {\n  color: #ff5722 !important;\n}\n\n.deep-orange.lighten-5 {\n  background-color: #fbe9e7 !important;\n}\n\n.deep-orange-text.text-lighten-5 {\n  color: #fbe9e7 !important;\n}\n\n.deep-orange.lighten-4 {\n  background-color: #ffccbc !important;\n}\n\n.deep-orange-text.text-lighten-4 {\n  color: #ffccbc !important;\n}\n\n.deep-orange.lighten-3 {\n  background-color: #ffab91 !important;\n}\n\n.deep-orange-text.text-lighten-3 {\n  color: #ffab91 !important;\n}\n\n.deep-orange.lighten-2 {\n  background-color: #ff8a65 !important;\n}\n\n.deep-orange-text.text-lighten-2 {\n  color: #ff8a65 !important;\n}\n\n.deep-orange.lighten-1 {\n  background-color: #ff7043 !important;\n}\n\n.deep-orange-text.text-lighten-1 {\n  color: #ff7043 !important;\n}\n\n.deep-orange.darken-1 {\n  background-color: #f4511e !important;\n}\n\n.deep-orange-text.text-darken-1 {\n  color: #f4511e !important;\n}\n\n.deep-orange.darken-2 {\n  background-color: #e64a19 !important;\n}\n\n.deep-orange-text.text-darken-2 {\n  color: #e64a19 !important;\n}\n\n.deep-orange.darken-3 {\n  background-color: #d84315 !important;\n}\n\n.deep-orange-text.text-darken-3 {\n  color: #d84315 !important;\n}\n\n.deep-orange.darken-4 {\n  background-color: #bf360c !important;\n}\n\n.deep-orange-text.text-darken-4 {\n  color: #bf360c !important;\n}\n\n.deep-orange.accent-1 {\n  background-color: #ff9e80 !important;\n}\n\n.deep-orange-text.text-accent-1 {\n  color: #ff9e80 !important;\n}\n\n.deep-orange.accent-2 {\n  background-color: #ff6e40 !important;\n}\n\n.deep-orange-text.text-accent-2 {\n  color: #ff6e40 !important;\n}\n\n.deep-orange.accent-3 {\n  background-color: #ff3d00 !important;\n}\n\n.deep-orange-text.text-accent-3 {\n  color: #ff3d00 !important;\n}\n\n.deep-orange.accent-4 {\n  background-color: #dd2c00 !important;\n}\n\n.deep-orange-text.text-accent-4 {\n  color: #dd2c00 !important;\n}\n\n.brown {\n  background-color: #795548 !important;\n}\n\n.brown-text {\n  color: #795548 !important;\n}\n\n.brown.lighten-5 {\n  background-color: #efebe9 !important;\n}\n\n.brown-text.text-lighten-5 {\n  color: #efebe9 !important;\n}\n\n.brown.lighten-4 {\n  background-color: #d7ccc8 !important;\n}\n\n.brown-text.text-lighten-4 {\n  color: #d7ccc8 !important;\n}\n\n.brown.lighten-3 {\n  background-color: #bcaaa4 !important;\n}\n\n.brown-text.text-lighten-3 {\n  color: #bcaaa4 !important;\n}\n\n.brown.lighten-2 {\n  background-color: #a1887f !important;\n}\n\n.brown-text.text-lighten-2 {\n  color: #a1887f !important;\n}\n\n.brown.lighten-1 {\n  background-color: #8d6e63 !important;\n}\n\n.brown-text.text-lighten-1 {\n  color: #8d6e63 !important;\n}\n\n.brown.darken-1 {\n  background-color: #6d4c41 !important;\n}\n\n.brown-text.text-darken-1 {\n  color: #6d4c41 !important;\n}\n\n.brown.darken-2 {\n  background-color: #5d4037 !important;\n}\n\n.brown-text.text-darken-2 {\n  color: #5d4037 !important;\n}\n\n.brown.darken-3 {\n  background-color: #4e342e !important;\n}\n\n.brown-text.text-darken-3 {\n  color: #4e342e !important;\n}\n\n.brown.darken-4 {\n  background-color: #3e2723 !important;\n}\n\n.brown-text.text-darken-4 {\n  color: #3e2723 !important;\n}\n\n.blue-grey {\n  background-color: #607d8b !important;\n}\n\n.blue-grey-text {\n  color: #607d8b !important;\n}\n\n.blue-grey.lighten-5 {\n  background-color: #eceff1 !important;\n}\n\n.blue-grey-text.text-lighten-5 {\n  color: #eceff1 !important;\n}\n\n.blue-grey.lighten-4 {\n  background-color: #cfd8dc !important;\n}\n\n.blue-grey-text.text-lighten-4 {\n  color: #cfd8dc !important;\n}\n\n.blue-grey.lighten-3 {\n  background-color: #b0bec5 !important;\n}\n\n.blue-grey-text.text-lighten-3 {\n  color: #b0bec5 !important;\n}\n\n.blue-grey.lighten-2 {\n  background-color: #90a4ae !important;\n}\n\n.blue-grey-text.text-lighten-2 {\n  color: #90a4ae !important;\n}\n\n.blue-grey.lighten-1 {\n  background-color: #78909c !important;\n}\n\n.blue-grey-text.text-lighten-1 {\n  color: #78909c !important;\n}\n\n.blue-grey.darken-1 {\n  background-color: #546e7a !important;\n}\n\n.blue-grey-text.text-darken-1 {\n  color: #546e7a !important;\n}\n\n.blue-grey.darken-2 {\n  background-color: #455a64 !important;\n}\n\n.blue-grey-text.text-darken-2 {\n  color: #455a64 !important;\n}\n\n.blue-grey.darken-3 {\n  background-color: #37474f !important;\n}\n\n.blue-grey-text.text-darken-3 {\n  color: #37474f !important;\n}\n\n.blue-grey.darken-4 {\n  background-color: #263238 !important;\n}\n\n.blue-grey-text.text-darken-4 {\n  color: #263238 !important;\n}\n\n.grey {\n  background-color: #9e9e9e !important;\n}\n\n.grey-text {\n  color: #9e9e9e !important;\n}\n\n.grey.lighten-5 {\n  background-color: #fafafa !important;\n}\n\n.grey-text.text-lighten-5 {\n  color: #fafafa !important;\n}\n\n.grey.lighten-4 {\n  background-color: #f5f5f5 !important;\n}\n\n.grey-text.text-lighten-4 {\n  color: #f5f5f5 !important;\n}\n\n.grey.lighten-3 {\n  background-color: #eeeeee !important;\n}\n\n.grey-text.text-lighten-3 {\n  color: #eeeeee !important;\n}\n\n.grey.lighten-2 {\n  background-color: #e0e0e0 !important;\n}\n\n.grey-text.text-lighten-2 {\n  color: #e0e0e0 !important;\n}\n\n.grey.lighten-1 {\n  background-color: #bdbdbd !important;\n}\n\n.grey-text.text-lighten-1 {\n  color: #bdbdbd !important;\n}\n\n.grey.darken-1 {\n  background-color: #757575 !important;\n}\n\n.grey-text.text-darken-1 {\n  color: #757575 !important;\n}\n\n.grey.darken-2 {\n  background-color: #616161 !important;\n}\n\n.grey-text.text-darken-2 {\n  color: #616161 !important;\n}\n\n.grey.darken-3 {\n  background-color: #424242 !important;\n}\n\n.grey-text.text-darken-3 {\n  color: #424242 !important;\n}\n\n.grey.darken-4 {\n  background-color: #212121 !important;\n}\n\n.grey-text.text-darken-4 {\n  color: #212121 !important;\n}\n\n.black {\n  background-color: #000000 !important;\n}\n\n.black-text {\n  color: #000000 !important;\n}\n\n.white {\n  background-color: #FFFFFF !important;\n}\n\n.white-text {\n  color: #FFFFFF !important;\n}\n\n.transparent {\n  background-color: transparent !important;\n}\n\n.transparent-text {\n  color: transparent !important;\n}\n\n/*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */\n\n/**\r\n * 1. Set default font family to sans-serif.\r\n * 2. Prevent iOS and IE text size adjust after device orientation change,\r\n *    without disabling user zoom.\r\n */\n\nhtml {\n  font-family: sans-serif;\n  /* 1 */\n  -ms-text-size-adjust: 100%;\n  /* 2 */\n  -webkit-text-size-adjust: 100%;\n  /* 2 */\n}\n\n/**\r\n * Remove default margin.\r\n */\n\nbody {\n  margin: 0;\n}\n\n/* HTML5 display definitions\r\n   ========================================================================== */\n\n/**\r\n * Correct `block` display not defined for any HTML5 element in IE 8/9.\r\n * Correct `block` display not defined for `details` or `summary` in IE 10/11\r\n * and Firefox.\r\n * Correct `block` display not defined for `main` in IE 11.\r\n */\n\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmain,\nmenu,\nnav,\nsection,\nsummary {\n  display: block;\n}\n\n/**\r\n * 1. Correct `inline-block` display not defined in IE 8/9.\r\n * 2. Normalize vertical alignment of `progress` in Chrome, Firefox, and Opera.\r\n */\n\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block;\n  /* 1 */\n  vertical-align: baseline;\n  /* 2 */\n}\n\n/**\r\n * Prevent modern browsers from displaying `audio` without controls.\r\n * Remove excess height in iOS 5 devices.\r\n */\n\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n\n/**\r\n * Address `[hidden]` styling not present in IE 8/9/10.\r\n * Hide the `template` element in IE 8/9/10/11, Safari, and Firefox < 22.\r\n */\n\n[hidden],\ntemplate {\n  display: none;\n}\n\n/* Links\r\n   ========================================================================== */\n\n/**\r\n * Remove the gray background color from active links in IE 10.\r\n */\n\na {\n  background-color: transparent;\n}\n\n/**\r\n * Improve readability of focused elements when they are also in an\r\n * active/hover state.\r\n */\n\na:active,\na:hover {\n  outline: 0;\n}\n\n/* Text-level semantics\r\n   ========================================================================== */\n\n/**\r\n * Address styling not present in IE 8/9/10/11, Safari, and Chrome.\r\n */\n\nabbr[title] {\n  border-bottom: 1px dotted;\n}\n\n/**\r\n * Address style set to `bolder` in Firefox 4+, Safari, and Chrome.\r\n */\n\nb,\nstrong {\n  font-weight: bold;\n}\n\n/**\r\n * Address styling not present in Safari and Chrome.\r\n */\n\ndfn {\n  font-style: italic;\n}\n\n/**\r\n * Address variable `h1` font-size and margin within `section` and `article`\r\n * contexts in Firefox 4+, Safari, and Chrome.\r\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/**\r\n * Address styling not present in IE 8/9.\r\n */\n\nmark {\n  background: #ff0;\n  color: #000;\n}\n\n/**\r\n * Address inconsistent and variable font size in all browsers.\r\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\r\n * Prevent `sub` and `sup` affecting `line-height` in all browsers.\r\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsup {\n  top: -0.5em;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\n/* Embedded content\r\n   ========================================================================== */\n\n/**\r\n * Remove border when inside `a` element in IE 8/9/10.\r\n */\n\nimg {\n  border: 0;\n}\n\n/**\r\n * Correct overflow not hidden in IE 9/10/11.\r\n */\n\nsvg:not(:root) {\n  overflow: hidden;\n}\n\n/* Grouping content\r\n   ========================================================================== */\n\n/**\r\n * Address margin not present in IE 8/9 and Safari.\r\n */\n\nfigure {\n  margin: 1em 40px;\n}\n\n/**\r\n * Address differences between Firefox and other browsers.\r\n */\n\nhr {\n  box-sizing: content-box;\n  height: 0;\n}\n\n/**\r\n * Contain overflow in all browsers.\r\n */\n\npre {\n  overflow: auto;\n}\n\n/**\r\n * Address odd `em`-unit font size rendering in all browsers.\r\n */\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em;\n}\n\n/* Forms\r\n   ========================================================================== */\n\n/**\r\n * Known limitation: by default, Chrome and Safari on OS X allow very limited\r\n * styling of `select`, unless a `border` property is set.\r\n */\n\n/**\r\n * 1. Correct color not being inherited.\r\n *    Known issue: affects color of disabled elements.\r\n * 2. Correct font properties not being inherited.\r\n * 3. Address margins set differently in Firefox 4+, Safari, and Chrome.\r\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  color: inherit;\n  /* 1 */\n  font: inherit;\n  /* 2 */\n  margin: 0;\n  /* 3 */\n}\n\n/**\r\n * Address `overflow` set to `hidden` in IE 8/9/10/11.\r\n */\n\nbutton {\n  overflow: visible;\n}\n\n/**\r\n * Address inconsistent `text-transform` inheritance for `button` and `select`.\r\n * All other form control elements do not inherit `text-transform` values.\r\n * Correct `button` style inheritance in Firefox, IE 8/9/10/11, and Opera.\r\n * Correct `select` style inheritance in Firefox.\r\n */\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/**\r\n * 1. Avoid the WebKit bug in Android 4.0.* where (2) destroys native `audio`\r\n *    and `video` controls.\r\n * 2. Correct inability to style clickable `input` types in iOS.\r\n * 3. Improve usability and consistency of cursor style between image-type\r\n *    `input` and others.\r\n */\n\nbutton,\nhtml input[type=\"button\"],\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n  -webkit-appearance: button;\n  /* 2 */\n  cursor: pointer;\n  /* 3 */\n}\n\n/**\r\n * Re-set default cursor for disabled elements.\r\n */\n\nbutton[disabled],\nhtml input[disabled] {\n  cursor: default;\n}\n\n/**\r\n * Remove inner padding and border in Firefox 4+.\r\n */\n\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n  border: 0;\n  padding: 0;\n}\n\n/**\r\n * Address Firefox 4+ setting `line-height` on `input` using `!important` in\r\n * the UA stylesheet.\r\n */\n\ninput {\n  line-height: normal;\n}\n\n/**\r\n * It's recommended that you don't attempt to style these elements.\r\n * Firefox's implementation doesn't respect box-sizing, padding, or width.\r\n *\r\n * 1. Address box sizing set to `content-box` in IE 8/9/10.\r\n * 2. Remove excess padding in IE 8/9/10.\r\n */\n\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n  box-sizing: border-box;\n  /* 1 */\n  padding: 0;\n  /* 2 */\n}\n\n/**\r\n * Fix the cursor style for Chrome's increment/decrement buttons. For certain\r\n * `font-size` values of the `input`, it causes the cursor style of the\r\n * decrement button to change from `default` to `text`.\r\n */\n\ninput[type=\"number\"]::-webkit-inner-spin-button,\ninput[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\r\n * 1. Address `appearance` set to `searchfield` in Safari and Chrome.\r\n * 2. Address `box-sizing` set to `border-box` in Safari and Chrome.\r\n */\n\ninput[type=\"search\"] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  box-sizing: content-box;\n  /* 2 */\n}\n\n/**\r\n * Remove inner padding and search cancel button in Safari and Chrome on OS X.\r\n * Safari (but not Chrome) clips the cancel button when the search input has\r\n * padding (and `textfield` appearance).\r\n */\n\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\r\n * Define consistent border, margin, and padding.\r\n */\n\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em;\n}\n\n/**\r\n * 1. Correct `color` not being inherited in IE 8/9/10/11.\r\n * 2. Remove padding so people aren't caught out if they zero out fieldsets.\r\n */\n\nlegend {\n  border: 0;\n  /* 1 */\n  padding: 0;\n  /* 2 */\n}\n\n/**\r\n * Remove default vertical scrollbar in IE 8/9/10/11.\r\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\r\n * Don't inherit the `font-weight` (applied by a rule above).\r\n * NOTE: the default cannot safely be changed in Chrome and Safari on OS X.\r\n */\n\noptgroup {\n  font-weight: bold;\n}\n\n/* Tables\r\n   ========================================================================== */\n\n/**\r\n * Remove most spacing between table cells.\r\n */\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n\ntd,\nth {\n  padding: 0;\n}\n\nhtml {\n  box-sizing: border-box;\n}\n\n*,\n*:before,\n*:after {\n  box-sizing: inherit;\n}\n\nul:not(.browser-default) {\n  padding-left: 0;\n  list-style-type: none;\n}\n\nul:not(.browser-default) > li {\n  list-style-type: none;\n}\n\na {\n  color: #039be5;\n  text-decoration: none;\n  -webkit-tap-highlight-color: transparent;\n}\n\n.valign-wrapper {\n  display: flex;\n  align-items: center;\n}\n\n.clearfix {\n  clear: both;\n}\n\n.z-depth-0 {\n  box-shadow: none !important;\n}\n\n.z-depth-1,\nnav,\n.btn,\n.btn-large,\n.btn-floating,\n.dropdown-content,\n.collapsible {\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);\n}\n\n.z-depth-1-half,\n.btn:hover,\n.btn-large:hover,\n.btn-floating:hover {\n  box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 7px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -1px rgba(0, 0, 0, 0.2);\n}\n\n.z-depth-2 {\n  box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.3);\n}\n\n.z-depth-3 {\n  box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.3);\n}\n\n.z-depth-4 {\n  box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.3);\n}\n\n.z-depth-5 {\n  box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.3);\n}\n\n.hoverable {\n  transition: box-shadow .25s;\n}\n\n.hoverable:hover {\n  box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);\n}\n\n.divider {\n  height: 1px;\n  overflow: hidden;\n  background-color: #e0e0e0;\n}\n\nblockquote {\n  margin: 20px 0;\n  padding-left: 1.5rem;\n  border-left: 5px solid #ee6e73;\n}\n\ni {\n  line-height: inherit;\n}\n\ni.left {\n  float: left;\n  margin-right: 15px;\n}\n\ni.right {\n  float: right;\n  margin-left: 15px;\n}\n\ni.tiny {\n  font-size: 1rem;\n}\n\ni.small {\n  font-size: 2rem;\n}\n\ni.medium {\n  font-size: 4rem;\n}\n\ni.large {\n  font-size: 6rem;\n}\n\nimg.responsive-img,\nvideo.responsive-video {\n  max-width: 100%;\n  height: auto;\n}\n\n.pagination li {\n  display: inline-block;\n  border-radius: 2px;\n  text-align: center;\n  vertical-align: top;\n  height: 30px;\n}\n\n.pagination li a {\n  color: #444;\n  display: inline-block;\n  font-size: 1.2rem;\n  padding: 0 10px;\n  line-height: 30px;\n}\n\n.pagination li.active a {\n  color: #fff;\n}\n\n.pagination li.active {\n  background-color: #ee6e73;\n}\n\n.pagination li.disabled a {\n  cursor: default;\n  color: #999;\n}\n\n.pagination li i {\n  font-size: 2rem;\n}\n\n.pagination li.pages ul li {\n  display: inline-block;\n  float: none;\n}\n\n@media only screen and (max-width: 992px) {\n  .pagination {\n    width: 100%;\n  }\n\n  .pagination li.prev,\n  .pagination li.next {\n    width: 10%;\n  }\n\n  .pagination li.pages {\n    width: 80%;\n    overflow: hidden;\n    white-space: nowrap;\n  }\n}\n\n.breadcrumb {\n  font-size: 18px;\n  color: rgba(255, 255, 255, 0.7);\n}\n\n.breadcrumb i,\n.breadcrumb [class^=\"mdi-\"],\n.breadcrumb [class*=\"mdi-\"],\n.breadcrumb i.material-icons {\n  display: inline-block;\n  float: left;\n  font-size: 24px;\n}\n\n.breadcrumb:before {\n  content: '\\E5CC';\n  color: rgba(255, 255, 255, 0.7);\n  vertical-align: top;\n  display: inline-block;\n  font-family: 'Material Icons';\n  font-weight: normal;\n  font-style: normal;\n  font-size: 25px;\n  margin: 0 10px 0 8px;\n  -webkit-font-smoothing: antialiased;\n}\n\n.breadcrumb:first-child:before {\n  display: none;\n}\n\n.breadcrumb:last-child {\n  color: #fff;\n}\n\n.parallax-container {\n  position: relative;\n  overflow: hidden;\n  height: 500px;\n}\n\n.parallax-container .parallax {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: -1;\n}\n\n.parallax-container .parallax img {\n  display: none;\n  position: absolute;\n  left: 50%;\n  bottom: 0;\n  min-width: 100%;\n  min-height: 100%;\n  transform: translate3d(0, 0, 0);\n  transform: translateX(-50%);\n}\n\n.pin-top,\n.pin-bottom {\n  position: relative;\n}\n\n.pinned {\n  position: fixed !important;\n}\n\n/*********************\r\n  Transition Classes\r\n**********************/\n\nul.staggered-list li {\n  opacity: 0;\n}\n\n.fade-in {\n  opacity: 0;\n  transform-origin: 0 50%;\n}\n\n/*********************\r\n  Media Query Classes\r\n**********************/\n\n@media only screen and (max-width: 600px) {\n  .hide-on-small-only,\n  .hide-on-small-and-down {\n    display: none !important;\n  }\n}\n\n@media only screen and (max-width: 992px) {\n  .hide-on-med-and-down {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 601px) {\n  .hide-on-med-and-up {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 600px) and (max-width: 992px) {\n  .hide-on-med-only {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 993px) {\n  .hide-on-large-only {\n    display: none !important;\n  }\n}\n\n@media only screen and (min-width: 993px) {\n  .show-on-large {\n    display: block !important;\n  }\n}\n\n@media only screen and (min-width: 600px) and (max-width: 992px) {\n  .show-on-medium {\n    display: block !important;\n  }\n}\n\n@media only screen and (max-width: 600px) {\n  .show-on-small {\n    display: block !important;\n  }\n}\n\n@media only screen and (min-width: 601px) {\n  .show-on-medium-and-up {\n    display: block !important;\n  }\n}\n\n@media only screen and (max-width: 992px) {\n  .show-on-medium-and-down {\n    display: block !important;\n  }\n}\n\n@media only screen and (max-width: 600px) {\n  .center-on-small-only {\n    text-align: center;\n  }\n}\n\n.page-footer {\n  padding-top: 20px;\n  color: #fff;\n  background-color: #ee6e73;\n}\n\n.page-footer .footer-copyright {\n  overflow: hidden;\n  min-height: 50px;\n  display: flex;\n  align-items: center;\n  padding: 10px 0px;\n  color: rgba(255, 255, 255, 0.8);\n  background-color: rgba(51, 51, 51, 0.08);\n}\n\ntable,\nth,\ntd {\n  border: none;\n}\n\ntable {\n  width: 100%;\n  display: table;\n}\n\ntable.bordered > thead > tr,\ntable.bordered > tbody > tr {\n  border-bottom: 1px solid #d0d0d0;\n}\n\ntable.striped > tbody > tr:nth-child(odd) {\n  background-color: #f2f2f2;\n}\n\ntable.striped > tbody > tr > td {\n  border-radius: 0;\n}\n\ntable.highlight > tbody > tr {\n  transition: background-color .25s ease;\n}\n\ntable.highlight > tbody > tr:hover {\n  background-color: #f2f2f2;\n}\n\ntable.centered thead tr th,\ntable.centered tbody tr td {\n  text-align: center;\n}\n\nthead {\n  border-bottom: 1px solid #d0d0d0;\n}\n\ntd,\nth {\n  padding: 15px 5px;\n  display: table-cell;\n  text-align: left;\n  vertical-align: middle;\n  border-radius: 2px;\n}\n\n@media only screen and (max-width: 992px) {\n  table.responsive-table {\n    width: 100%;\n    border-collapse: collapse;\n    border-spacing: 0;\n    display: block;\n    position: relative;\n    /* sort out borders */\n  }\n\n  table.responsive-table td:empty:before {\n    content: '\\00a0';\n  }\n\n  table.responsive-table th,\n  table.responsive-table td {\n    margin: 0;\n    vertical-align: top;\n  }\n\n  table.responsive-table th {\n    text-align: left;\n  }\n\n  table.responsive-table thead {\n    display: block;\n    float: left;\n  }\n\n  table.responsive-table thead tr {\n    display: block;\n    padding: 0 10px 0 0;\n  }\n\n  table.responsive-table thead tr th::before {\n    content: \"\\00a0\";\n  }\n\n  table.responsive-table tbody {\n    display: block;\n    width: auto;\n    position: relative;\n    overflow-x: auto;\n    white-space: nowrap;\n  }\n\n  table.responsive-table tbody tr {\n    display: inline-block;\n    vertical-align: top;\n  }\n\n  table.responsive-table th {\n    display: block;\n    text-align: right;\n  }\n\n  table.responsive-table td {\n    display: block;\n    min-height: 1.25em;\n    text-align: left;\n  }\n\n  table.responsive-table tr {\n    padding: 0 10px;\n  }\n\n  table.responsive-table thead {\n    border: 0;\n    border-right: 1px solid #d0d0d0;\n  }\n\n  table.responsive-table.bordered th {\n    border-bottom: 0;\n    border-left: 0;\n  }\n\n  table.responsive-table.bordered td {\n    border-left: 0;\n    border-right: 0;\n    border-bottom: 0;\n  }\n\n  table.responsive-table.bordered tr {\n    border: 0;\n  }\n\n  table.responsive-table.bordered tbody tr {\n    border-right: 1px solid #d0d0d0;\n  }\n}\n\n.collection {\n  margin: 0.5rem 0 1rem 0;\n  border: 1px solid #e0e0e0;\n  border-radius: 2px;\n  overflow: hidden;\n  position: relative;\n}\n\n.collection .collection-item {\n  background-color: #fff;\n  line-height: 1.5rem;\n  padding: 10px 20px;\n  margin: 0;\n  border-bottom: 1px solid #e0e0e0;\n}\n\n.collection .collection-item.avatar {\n  min-height: 84px;\n  padding-left: 72px;\n  position: relative;\n}\n\n.collection .collection-item.avatar:not(.circle-clipper) > .circle,\n.collection .collection-item.avatar :not(.circle-clipper) > .circle {\n  position: absolute;\n  width: 42px;\n  height: 42px;\n  overflow: hidden;\n  left: 15px;\n  display: inline-block;\n  vertical-align: middle;\n}\n\n.collection .collection-item.avatar i.circle {\n  font-size: 18px;\n  line-height: 42px;\n  color: #fff;\n  background-color: #999;\n  text-align: center;\n}\n\n.collection .collection-item.avatar .title {\n  font-size: 16px;\n}\n\n.collection .collection-item.avatar p {\n  margin: 0;\n}\n\n.collection .collection-item.avatar .secondary-content {\n  position: absolute;\n  top: 16px;\n  right: 16px;\n}\n\n.collection .collection-item:last-child {\n  border-bottom: none;\n}\n\n.collection .collection-item.active {\n  background-color: #26a69a;\n  color: #eafaf9;\n}\n\n.collection .collection-item.active .secondary-content {\n  color: #fff;\n}\n\n.collection a.collection-item {\n  display: block;\n  transition: .25s;\n  color: #26a69a;\n}\n\n.collection a.collection-item:not(.active):hover {\n  background-color: #ddd;\n}\n\n.collection.with-header .collection-header {\n  background-color: #fff;\n  border-bottom: 1px solid #e0e0e0;\n  padding: 10px 20px;\n}\n\n.collection.with-header .collection-item {\n  padding-left: 30px;\n}\n\n.collection.with-header .collection-item.avatar {\n  padding-left: 72px;\n}\n\n.secondary-content {\n  float: right;\n  color: #26a69a;\n}\n\n.collapsible .collection {\n  margin: 0;\n  border: none;\n}\n\n.video-container {\n  position: relative;\n  padding-bottom: 56.25%;\n  height: 0;\n  overflow: hidden;\n}\n\n.video-container iframe,\n.video-container object,\n.video-container embed {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}\n\n.progress {\n  position: relative;\n  height: 4px;\n  display: block;\n  width: 100%;\n  background-color: #acece6;\n  border-radius: 2px;\n  margin: 0.5rem 0 1rem 0;\n  overflow: hidden;\n}\n\n.progress .determinate {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  background-color: #26a69a;\n  transition: width .3s linear;\n}\n\n.progress .indeterminate {\n  background-color: #26a69a;\n}\n\n.progress .indeterminate:before {\n  content: '';\n  position: absolute;\n  background-color: inherit;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  will-change: left, right;\n  animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;\n}\n\n.progress .indeterminate:after {\n  content: '';\n  position: absolute;\n  background-color: inherit;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  will-change: left, right;\n  animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;\n  animation-delay: 1.15s;\n}\n\n@keyframes indeterminate {\n  0% {\n    left: -35%;\n    right: 100%;\n  }\n\n  60% {\n    left: 100%;\n    right: -90%;\n  }\n\n  100% {\n    left: 100%;\n    right: -90%;\n  }\n}\n\n@keyframes indeterminate-short {\n  0% {\n    left: -200%;\n    right: 100%;\n  }\n\n  60% {\n    left: 107%;\n    right: -8%;\n  }\n\n  100% {\n    left: 107%;\n    right: -8%;\n  }\n}\n\n/*******************\r\n  Utility Classes\r\n*******************/\n\n.hide {\n  display: none !important;\n}\n\n.left-align {\n  text-align: left;\n}\n\n.right-align {\n  text-align: right;\n}\n\n.center,\n.center-align {\n  text-align: center;\n}\n\n.left {\n  float: left !important;\n}\n\n.right {\n  float: right !important;\n}\n\n.no-select,\ninput[type=range],\ninput[type=range] + .thumb {\n  user-select: none;\n}\n\n.circle {\n  border-radius: 50%;\n}\n\n.center-block {\n  display: block;\n  margin-left: auto;\n  margin-right: auto;\n}\n\n.truncate {\n  display: block;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.no-padding {\n  padding: 0 !important;\n}\n\n.container {\n  margin: 0 auto;\n  max-width: 1280px;\n  width: 90%;\n}\n\n@media only screen and (min-width: 601px) {\n  .container {\n    width: 85%;\n  }\n}\n\n@media only screen and (min-width: 993px) {\n  .container {\n    width: 70%;\n  }\n}\n\n.container .row {\n  margin-left: -0.75rem;\n  margin-right: -0.75rem;\n}\n\n.section {\n  padding-top: 1rem;\n  padding-bottom: 1rem;\n}\n\n.section.no-pad {\n  padding: 0;\n}\n\n.section.no-pad-bot {\n  padding-bottom: 0;\n}\n\n.section.no-pad-top {\n  padding-top: 0;\n}\n\n.row {\n  margin-left: auto;\n  margin-right: auto;\n  margin-bottom: 20px;\n}\n\n.row:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n\n.row .col {\n  float: left;\n  box-sizing: border-box;\n  padding: 0 0.75rem;\n  min-height: 1px;\n}\n\n.row .col[class*=\"push-\"],\n.row .col[class*=\"pull-\"] {\n  position: relative;\n}\n\n.row .col.s1 {\n  width: 8.33333%;\n  margin-left: auto;\n  left: auto;\n  right: auto;\n}\n\n.row .col.s2 {\n  width: 16.66667%;\n  margin-left: auto;\n  left: auto;\n  right: auto;\n}\n\n.row .col.s3 {\n  width: 25%;\n  margin-left: auto;\n  left: auto;\n  right: auto;\n}\n\n.row .col.s4 {\n  width: 33.33333%;\n  margin-left: auto;\n  left: auto;\n  right: auto;\n}\n\n.row .col.s5 {\n  width: 41.66667%;\n  margin-left: auto;\n  left: auto;\n  right: auto;\n}\n\n.row .col.s6 {\n  width: 50%;\n  margin-left: auto;\n  left: auto;\n  right: auto;\n}\n\n.row .col.s7 {\n  width: 58.33333%;\n  margin-left: auto;\n  left: auto;\n  right: auto;\n}\n\n.row .col.s8 {\n  width: 66.66667%;\n  margin-left: auto;\n  left: auto;\n  right: auto;\n}\n\n.row .col.s9 {\n  width: 75%;\n  margin-left: auto;\n  left: auto;\n  right: auto;\n}\n\n.row .col.s10 {\n  width: 83.33333%;\n  margin-left: auto;\n  left: auto;\n  right: auto;\n}\n\n.row .col.s11 {\n  width: 91.66667%;\n  margin-left: auto;\n  left: auto;\n  right: auto;\n}\n\n.row .col.s12 {\n  width: 100%;\n  margin-left: auto;\n  left: auto;\n  right: auto;\n}\n\n.row .col.offset-s1 {\n  margin-left: 8.33333%;\n}\n\n.row .col.pull-s1 {\n  right: 8.33333%;\n}\n\n.row .col.push-s1 {\n  left: 8.33333%;\n}\n\n.row .col.offset-s2 {\n  margin-left: 16.66667%;\n}\n\n.row .col.pull-s2 {\n  right: 16.66667%;\n}\n\n.row .col.push-s2 {\n  left: 16.66667%;\n}\n\n.row .col.offset-s3 {\n  margin-left: 25%;\n}\n\n.row .col.pull-s3 {\n  right: 25%;\n}\n\n.row .col.push-s3 {\n  left: 25%;\n}\n\n.row .col.offset-s4 {\n  margin-left: 33.33333%;\n}\n\n.row .col.pull-s4 {\n  right: 33.33333%;\n}\n\n.row .col.push-s4 {\n  left: 33.33333%;\n}\n\n.row .col.offset-s5 {\n  margin-left: 41.66667%;\n}\n\n.row .col.pull-s5 {\n  right: 41.66667%;\n}\n\n.row .col.push-s5 {\n  left: 41.66667%;\n}\n\n.row .col.offset-s6 {\n  margin-left: 50%;\n}\n\n.row .col.pull-s6 {\n  right: 50%;\n}\n\n.row .col.push-s6 {\n  left: 50%;\n}\n\n.row .col.offset-s7 {\n  margin-left: 58.33333%;\n}\n\n.row .col.pull-s7 {\n  right: 58.33333%;\n}\n\n.row .col.push-s7 {\n  left: 58.33333%;\n}\n\n.row .col.offset-s8 {\n  margin-left: 66.66667%;\n}\n\n.row .col.pull-s8 {\n  right: 66.66667%;\n}\n\n.row .col.push-s8 {\n  left: 66.66667%;\n}\n\n.row .col.offset-s9 {\n  margin-left: 75%;\n}\n\n.row .col.pull-s9 {\n  right: 75%;\n}\n\n.row .col.push-s9 {\n  left: 75%;\n}\n\n.row .col.offset-s10 {\n  margin-left: 83.33333%;\n}\n\n.row .col.pull-s10 {\n  right: 83.33333%;\n}\n\n.row .col.push-s10 {\n  left: 83.33333%;\n}\n\n.row .col.offset-s11 {\n  margin-left: 91.66667%;\n}\n\n.row .col.pull-s11 {\n  right: 91.66667%;\n}\n\n.row .col.push-s11 {\n  left: 91.66667%;\n}\n\n.row .col.offset-s12 {\n  margin-left: 100%;\n}\n\n.row .col.pull-s12 {\n  right: 100%;\n}\n\n.row .col.push-s12 {\n  left: 100%;\n}\n\n@media only screen and (min-width: 601px) {\n  .row .col.m1 {\n    width: 8.33333%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.m2 {\n    width: 16.66667%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.m3 {\n    width: 25%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.m4 {\n    width: 33.33333%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.m5 {\n    width: 41.66667%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.m6 {\n    width: 50%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.m7 {\n    width: 58.33333%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.m8 {\n    width: 66.66667%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.m9 {\n    width: 75%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.m10 {\n    width: 83.33333%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.m11 {\n    width: 91.66667%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.m12 {\n    width: 100%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.offset-m1 {\n    margin-left: 8.33333%;\n  }\n\n  .row .col.pull-m1 {\n    right: 8.33333%;\n  }\n\n  .row .col.push-m1 {\n    left: 8.33333%;\n  }\n\n  .row .col.offset-m2 {\n    margin-left: 16.66667%;\n  }\n\n  .row .col.pull-m2 {\n    right: 16.66667%;\n  }\n\n  .row .col.push-m2 {\n    left: 16.66667%;\n  }\n\n  .row .col.offset-m3 {\n    margin-left: 25%;\n  }\n\n  .row .col.pull-m3 {\n    right: 25%;\n  }\n\n  .row .col.push-m3 {\n    left: 25%;\n  }\n\n  .row .col.offset-m4 {\n    margin-left: 33.33333%;\n  }\n\n  .row .col.pull-m4 {\n    right: 33.33333%;\n  }\n\n  .row .col.push-m4 {\n    left: 33.33333%;\n  }\n\n  .row .col.offset-m5 {\n    margin-left: 41.66667%;\n  }\n\n  .row .col.pull-m5 {\n    right: 41.66667%;\n  }\n\n  .row .col.push-m5 {\n    left: 41.66667%;\n  }\n\n  .row .col.offset-m6 {\n    margin-left: 50%;\n  }\n\n  .row .col.pull-m6 {\n    right: 50%;\n  }\n\n  .row .col.push-m6 {\n    left: 50%;\n  }\n\n  .row .col.offset-m7 {\n    margin-left: 58.33333%;\n  }\n\n  .row .col.pull-m7 {\n    right: 58.33333%;\n  }\n\n  .row .col.push-m7 {\n    left: 58.33333%;\n  }\n\n  .row .col.offset-m8 {\n    margin-left: 66.66667%;\n  }\n\n  .row .col.pull-m8 {\n    right: 66.66667%;\n  }\n\n  .row .col.push-m8 {\n    left: 66.66667%;\n  }\n\n  .row .col.offset-m9 {\n    margin-left: 75%;\n  }\n\n  .row .col.pull-m9 {\n    right: 75%;\n  }\n\n  .row .col.push-m9 {\n    left: 75%;\n  }\n\n  .row .col.offset-m10 {\n    margin-left: 83.33333%;\n  }\n\n  .row .col.pull-m10 {\n    right: 83.33333%;\n  }\n\n  .row .col.push-m10 {\n    left: 83.33333%;\n  }\n\n  .row .col.offset-m11 {\n    margin-left: 91.66667%;\n  }\n\n  .row .col.pull-m11 {\n    right: 91.66667%;\n  }\n\n  .row .col.push-m11 {\n    left: 91.66667%;\n  }\n\n  .row .col.offset-m12 {\n    margin-left: 100%;\n  }\n\n  .row .col.pull-m12 {\n    right: 100%;\n  }\n\n  .row .col.push-m12 {\n    left: 100%;\n  }\n}\n\n@media only screen and (min-width: 993px) {\n  .row .col.l1 {\n    width: 8.33333%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.l2 {\n    width: 16.66667%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.l3 {\n    width: 25%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.l4 {\n    width: 33.33333%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.l5 {\n    width: 41.66667%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.l6 {\n    width: 50%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.l7 {\n    width: 58.33333%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.l8 {\n    width: 66.66667%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.l9 {\n    width: 75%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.l10 {\n    width: 83.33333%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.l11 {\n    width: 91.66667%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.l12 {\n    width: 100%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.offset-l1 {\n    margin-left: 8.33333%;\n  }\n\n  .row .col.pull-l1 {\n    right: 8.33333%;\n  }\n\n  .row .col.push-l1 {\n    left: 8.33333%;\n  }\n\n  .row .col.offset-l2 {\n    margin-left: 16.66667%;\n  }\n\n  .row .col.pull-l2 {\n    right: 16.66667%;\n  }\n\n  .row .col.push-l2 {\n    left: 16.66667%;\n  }\n\n  .row .col.offset-l3 {\n    margin-left: 25%;\n  }\n\n  .row .col.pull-l3 {\n    right: 25%;\n  }\n\n  .row .col.push-l3 {\n    left: 25%;\n  }\n\n  .row .col.offset-l4 {\n    margin-left: 33.33333%;\n  }\n\n  .row .col.pull-l4 {\n    right: 33.33333%;\n  }\n\n  .row .col.push-l4 {\n    left: 33.33333%;\n  }\n\n  .row .col.offset-l5 {\n    margin-left: 41.66667%;\n  }\n\n  .row .col.pull-l5 {\n    right: 41.66667%;\n  }\n\n  .row .col.push-l5 {\n    left: 41.66667%;\n  }\n\n  .row .col.offset-l6 {\n    margin-left: 50%;\n  }\n\n  .row .col.pull-l6 {\n    right: 50%;\n  }\n\n  .row .col.push-l6 {\n    left: 50%;\n  }\n\n  .row .col.offset-l7 {\n    margin-left: 58.33333%;\n  }\n\n  .row .col.pull-l7 {\n    right: 58.33333%;\n  }\n\n  .row .col.push-l7 {\n    left: 58.33333%;\n  }\n\n  .row .col.offset-l8 {\n    margin-left: 66.66667%;\n  }\n\n  .row .col.pull-l8 {\n    right: 66.66667%;\n  }\n\n  .row .col.push-l8 {\n    left: 66.66667%;\n  }\n\n  .row .col.offset-l9 {\n    margin-left: 75%;\n  }\n\n  .row .col.pull-l9 {\n    right: 75%;\n  }\n\n  .row .col.push-l9 {\n    left: 75%;\n  }\n\n  .row .col.offset-l10 {\n    margin-left: 83.33333%;\n  }\n\n  .row .col.pull-l10 {\n    right: 83.33333%;\n  }\n\n  .row .col.push-l10 {\n    left: 83.33333%;\n  }\n\n  .row .col.offset-l11 {\n    margin-left: 91.66667%;\n  }\n\n  .row .col.pull-l11 {\n    right: 91.66667%;\n  }\n\n  .row .col.push-l11 {\n    left: 91.66667%;\n  }\n\n  .row .col.offset-l12 {\n    margin-left: 100%;\n  }\n\n  .row .col.pull-l12 {\n    right: 100%;\n  }\n\n  .row .col.push-l12 {\n    left: 100%;\n  }\n}\n\n@media only screen and (min-width: 1201px) {\n  .row .col.xl1 {\n    width: 8.33333%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.xl2 {\n    width: 16.66667%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.xl3 {\n    width: 25%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.xl4 {\n    width: 33.33333%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.xl5 {\n    width: 41.66667%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.xl6 {\n    width: 50%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.xl7 {\n    width: 58.33333%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.xl8 {\n    width: 66.66667%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.xl9 {\n    width: 75%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.xl10 {\n    width: 83.33333%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.xl11 {\n    width: 91.66667%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.xl12 {\n    width: 100%;\n    margin-left: auto;\n    left: auto;\n    right: auto;\n  }\n\n  .row .col.offset-xl1 {\n    margin-left: 8.33333%;\n  }\n\n  .row .col.pull-xl1 {\n    right: 8.33333%;\n  }\n\n  .row .col.push-xl1 {\n    left: 8.33333%;\n  }\n\n  .row .col.offset-xl2 {\n    margin-left: 16.66667%;\n  }\n\n  .row .col.pull-xl2 {\n    right: 16.66667%;\n  }\n\n  .row .col.push-xl2 {\n    left: 16.66667%;\n  }\n\n  .row .col.offset-xl3 {\n    margin-left: 25%;\n  }\n\n  .row .col.pull-xl3 {\n    right: 25%;\n  }\n\n  .row .col.push-xl3 {\n    left: 25%;\n  }\n\n  .row .col.offset-xl4 {\n    margin-left: 33.33333%;\n  }\n\n  .row .col.pull-xl4 {\n    right: 33.33333%;\n  }\n\n  .row .col.push-xl4 {\n    left: 33.33333%;\n  }\n\n  .row .col.offset-xl5 {\n    margin-left: 41.66667%;\n  }\n\n  .row .col.pull-xl5 {\n    right: 41.66667%;\n  }\n\n  .row .col.push-xl5 {\n    left: 41.66667%;\n  }\n\n  .row .col.offset-xl6 {\n    margin-left: 50%;\n  }\n\n  .row .col.pull-xl6 {\n    right: 50%;\n  }\n\n  .row .col.push-xl6 {\n    left: 50%;\n  }\n\n  .row .col.offset-xl7 {\n    margin-left: 58.33333%;\n  }\n\n  .row .col.pull-xl7 {\n    right: 58.33333%;\n  }\n\n  .row .col.push-xl7 {\n    left: 58.33333%;\n  }\n\n  .row .col.offset-xl8 {\n    margin-left: 66.66667%;\n  }\n\n  .row .col.pull-xl8 {\n    right: 66.66667%;\n  }\n\n  .row .col.push-xl8 {\n    left: 66.66667%;\n  }\n\n  .row .col.offset-xl9 {\n    margin-left: 75%;\n  }\n\n  .row .col.pull-xl9 {\n    right: 75%;\n  }\n\n  .row .col.push-xl9 {\n    left: 75%;\n  }\n\n  .row .col.offset-xl10 {\n    margin-left: 83.33333%;\n  }\n\n  .row .col.pull-xl10 {\n    right: 83.33333%;\n  }\n\n  .row .col.push-xl10 {\n    left: 83.33333%;\n  }\n\n  .row .col.offset-xl11 {\n    margin-left: 91.66667%;\n  }\n\n  .row .col.pull-xl11 {\n    right: 91.66667%;\n  }\n\n  .row .col.push-xl11 {\n    left: 91.66667%;\n  }\n\n  .row .col.offset-xl12 {\n    margin-left: 100%;\n  }\n\n  .row .col.pull-xl12 {\n    right: 100%;\n  }\n\n  .row .col.push-xl12 {\n    left: 100%;\n  }\n}\n\nnav {\n  color: #fff;\n  background-color: #ee6e73;\n  width: 100%;\n  height: 56px;\n  line-height: 56px;\n}\n\nnav.nav-extended {\n  height: auto;\n}\n\nnav.nav-extended .nav-wrapper {\n  min-height: 56px;\n  height: auto;\n}\n\nnav.nav-extended .nav-content {\n  position: relative;\n  line-height: normal;\n}\n\nnav a {\n  color: #fff;\n}\n\nnav i,\nnav [class^=\"mdi-\"],\nnav [class*=\"mdi-\"],\nnav i.material-icons {\n  display: block;\n  font-size: 24px;\n  height: 56px;\n  line-height: 56px;\n}\n\nnav .nav-wrapper {\n  position: relative;\n  height: 100%;\n}\n\n@media only screen and (min-width: 993px) {\n  nav a.button-collapse {\n    display: none;\n  }\n}\n\nnav .button-collapse {\n  float: left;\n  position: relative;\n  z-index: 1;\n  height: 56px;\n  margin: 0 18px;\n}\n\nnav .button-collapse i {\n  height: 56px;\n  line-height: 56px;\n}\n\nnav .brand-logo {\n  position: absolute;\n  color: #fff;\n  display: inline-block;\n  font-size: 2.1rem;\n  padding: 0;\n}\n\nnav .brand-logo.center {\n  left: 50%;\n  transform: translateX(-50%);\n}\n\n@media only screen and (max-width: 992px) {\n  nav .brand-logo {\n    left: 50%;\n    transform: translateX(-50%);\n  }\n\n  nav .brand-logo.left,\n  nav .brand-logo.right {\n    padding: 0;\n    transform: none;\n  }\n\n  nav .brand-logo.left {\n    left: 0.5rem;\n  }\n\n  nav .brand-logo.right {\n    right: 0.5rem;\n    left: auto;\n  }\n}\n\nnav .brand-logo.right {\n  right: 0.5rem;\n  padding: 0;\n}\n\nnav .brand-logo i,\nnav .brand-logo [class^=\"mdi-\"],\nnav .brand-logo [class*=\"mdi-\"],\nnav .brand-logo i.material-icons {\n  float: left;\n  margin-right: 15px;\n}\n\nnav .nav-title {\n  display: inline-block;\n  font-size: 32px;\n  padding: 28px 0;\n}\n\nnav ul {\n  margin: 0;\n}\n\nnav ul li {\n  transition: background-color .3s;\n  float: left;\n  padding: 0;\n}\n\nnav ul li.active {\n  background-color: rgba(0, 0, 0, 0.1);\n}\n\nnav ul a {\n  transition: background-color .3s;\n  font-size: 1rem;\n  color: #fff;\n  display: block;\n  padding: 0 15px;\n  cursor: pointer;\n}\n\nnav ul a.btn,\nnav ul a.btn-large,\nnav ul a.btn-large,\nnav ul a.btn-flat,\nnav ul a.btn-floating {\n  margin-top: -2px;\n  margin-left: 15px;\n  margin-right: 15px;\n}\n\nnav ul a.btn > .material-icons,\nnav ul a.btn-large > .material-icons,\nnav ul a.btn-large > .material-icons,\nnav ul a.btn-flat > .material-icons,\nnav ul a.btn-floating > .material-icons {\n  height: inherit;\n  line-height: inherit;\n}\n\nnav ul a:hover {\n  background-color: rgba(0, 0, 0, 0.1);\n}\n\nnav ul.left {\n  float: left;\n}\n\nnav form {\n  height: 100%;\n}\n\nnav .input-field {\n  margin: 0;\n  height: 100%;\n}\n\nnav .input-field input {\n  height: 100%;\n  font-size: 1.2rem;\n  border: none;\n  padding-left: 2rem;\n}\n\nnav .input-field input:focus,\nnav .input-field input[type=text]:valid,\nnav .input-field input[type=password]:valid,\nnav .input-field input[type=email]:valid,\nnav .input-field input[type=url]:valid,\nnav .input-field input[type=date]:valid {\n  border: none;\n  box-shadow: none;\n}\n\nnav .input-field label {\n  top: 0;\n  left: 0;\n}\n\nnav .input-field label i {\n  color: rgba(255, 255, 255, 0.7);\n  transition: color .3s;\n}\n\nnav .input-field label.active i {\n  color: #fff;\n}\n\n.navbar-fixed {\n  position: relative;\n  height: 56px;\n  z-index: 997;\n}\n\n.navbar-fixed nav {\n  position: fixed;\n}\n\n@media only screen and (min-width: 601px) {\n  nav.nav-extended .nav-wrapper {\n    min-height: 64px;\n  }\n\n  nav,\n  nav .nav-wrapper i,\n  nav a.button-collapse,\n  nav a.button-collapse i {\n    height: 64px;\n    line-height: 64px;\n  }\n\n  .navbar-fixed {\n    height: 64px;\n  }\n}\n\na {\n  text-decoration: none;\n}\n\nhtml {\n  line-height: 1.5;\n  font-family: \"Roboto\", sans-serif;\n  font-weight: normal;\n  color: rgba(0, 0, 0, 0.87);\n}\n\n@media only screen and (min-width: 0) {\n  html {\n    font-size: 14px;\n  }\n}\n\n@media only screen and (min-width: 992px) {\n  html {\n    font-size: 14.5px;\n  }\n}\n\n@media only screen and (min-width: 1200px) {\n  html {\n    font-size: 15px;\n  }\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-weight: 400;\n  line-height: 1.1;\n}\n\nh1 a,\nh2 a,\nh3 a,\nh4 a,\nh5 a,\nh6 a {\n  font-weight: inherit;\n}\n\nh1 {\n  font-size: 4.2rem;\n  line-height: 110%;\n  margin: 2.1rem 0 1.68rem 0;\n}\n\nh2 {\n  font-size: 3.56rem;\n  line-height: 110%;\n  margin: 1.78rem 0 1.424rem 0;\n}\n\nh3 {\n  font-size: 2.92rem;\n  line-height: 110%;\n  margin: 1.46rem 0 1.168rem 0;\n}\n\nh4 {\n  font-size: 2.28rem;\n  line-height: 110%;\n  margin: 1.14rem 0 0.912rem 0;\n}\n\nh5 {\n  font-size: 1.64rem;\n  line-height: 110%;\n  margin: 0.82rem 0 0.656rem 0;\n}\n\nh6 {\n  font-size: 1rem;\n  line-height: 110%;\n  margin: 0.5rem 0 0.4rem 0;\n}\n\nem {\n  font-style: italic;\n}\n\nstrong {\n  font-weight: 500;\n}\n\nsmall {\n  font-size: 75%;\n}\n\n.light,\n.page-footer .footer-copyright {\n  font-weight: 300;\n}\n\n.thin {\n  font-weight: 200;\n}\n\n.flow-text {\n  font-weight: 300;\n}\n\n@media only screen and (min-width: 360px) {\n  .flow-text {\n    font-size: 1.2rem;\n  }\n}\n\n@media only screen and (min-width: 390px) {\n  .flow-text {\n    font-size: 1.224rem;\n  }\n}\n\n@media only screen and (min-width: 420px) {\n  .flow-text {\n    font-size: 1.248rem;\n  }\n}\n\n@media only screen and (min-width: 450px) {\n  .flow-text {\n    font-size: 1.272rem;\n  }\n}\n\n@media only screen and (min-width: 480px) {\n  .flow-text {\n    font-size: 1.296rem;\n  }\n}\n\n@media only screen and (min-width: 510px) {\n  .flow-text {\n    font-size: 1.32rem;\n  }\n}\n\n@media only screen and (min-width: 540px) {\n  .flow-text {\n    font-size: 1.344rem;\n  }\n}\n\n@media only screen and (min-width: 570px) {\n  .flow-text {\n    font-size: 1.368rem;\n  }\n}\n\n@media only screen and (min-width: 600px) {\n  .flow-text {\n    font-size: 1.392rem;\n  }\n}\n\n@media only screen and (min-width: 630px) {\n  .flow-text {\n    font-size: 1.416rem;\n  }\n}\n\n@media only screen and (min-width: 660px) {\n  .flow-text {\n    font-size: 1.44rem;\n  }\n}\n\n@media only screen and (min-width: 690px) {\n  .flow-text {\n    font-size: 1.464rem;\n  }\n}\n\n@media only screen and (min-width: 720px) {\n  .flow-text {\n    font-size: 1.488rem;\n  }\n}\n\n@media only screen and (min-width: 750px) {\n  .flow-text {\n    font-size: 1.512rem;\n  }\n}\n\n@media only screen and (min-width: 780px) {\n  .flow-text {\n    font-size: 1.536rem;\n  }\n}\n\n@media only screen and (min-width: 810px) {\n  .flow-text {\n    font-size: 1.56rem;\n  }\n}\n\n@media only screen and (min-width: 840px) {\n  .flow-text {\n    font-size: 1.584rem;\n  }\n}\n\n@media only screen and (min-width: 870px) {\n  .flow-text {\n    font-size: 1.608rem;\n  }\n}\n\n@media only screen and (min-width: 900px) {\n  .flow-text {\n    font-size: 1.632rem;\n  }\n}\n\n@media only screen and (min-width: 930px) {\n  .flow-text {\n    font-size: 1.656rem;\n  }\n}\n\n@media only screen and (min-width: 960px) {\n  .flow-text {\n    font-size: 1.68rem;\n  }\n}\n\n@media only screen and (max-width: 360px) {\n  .flow-text {\n    font-size: 1.2rem;\n  }\n}\n\n.btn,\n.btn-large,\n.btn-flat {\n  border: none;\n  border-radius: 2px;\n  display: inline-block;\n  height: 36px;\n  line-height: 36px;\n  padding: 0 2rem;\n  text-transform: uppercase;\n  vertical-align: middle;\n  -webkit-tap-highlight-color: transparent;\n}\n\n.btn.disabled,\n.disabled.btn-large,\n.btn-floating.disabled,\n.btn-large.disabled,\n.btn-flat.disabled,\n.btn:disabled,\n.btn-large:disabled,\n.btn-floating:disabled,\n.btn-large:disabled,\n.btn-flat:disabled,\n.btn[disabled],\n.btn-large[disabled],\n.btn-floating[disabled],\n.btn-large[disabled],\n.btn-flat[disabled] {\n  pointer-events: none;\n  background-color: #DFDFDF !important;\n  box-shadow: none;\n  color: #9F9F9F !important;\n  cursor: default;\n}\n\n.btn.disabled:hover,\n.disabled.btn-large:hover,\n.btn-floating.disabled:hover,\n.btn-large.disabled:hover,\n.btn-flat.disabled:hover,\n.btn:disabled:hover,\n.btn-large:disabled:hover,\n.btn-floating:disabled:hover,\n.btn-large:disabled:hover,\n.btn-flat:disabled:hover,\n.btn[disabled]:hover,\n.btn-large[disabled]:hover,\n.btn-floating[disabled]:hover,\n.btn-large[disabled]:hover,\n.btn-flat[disabled]:hover {\n  background-color: #DFDFDF !important;\n  color: #9F9F9F !important;\n}\n\n.btn,\n.btn-large,\n.btn-floating,\n.btn-large,\n.btn-flat {\n  font-size: 1rem;\n  outline: 0;\n}\n\n.btn i,\n.btn-large i,\n.btn-floating i,\n.btn-large i,\n.btn-flat i {\n  font-size: 1.3rem;\n  line-height: inherit;\n}\n\n.btn:focus,\n.btn-large:focus,\n.btn-floating:focus {\n  background-color: #1d7d74;\n}\n\n.btn,\n.btn-large {\n  text-decoration: none;\n  color: #fff;\n  background-color: #26a69a;\n  text-align: center;\n  letter-spacing: .5px;\n  transition: .2s ease-out;\n  cursor: pointer;\n}\n\n.btn:hover,\n.btn-large:hover {\n  background-color: #2bbbad;\n}\n\n.btn-floating {\n  display: inline-block;\n  color: #fff;\n  position: relative;\n  overflow: hidden;\n  z-index: 1;\n  width: 40px;\n  height: 40px;\n  line-height: 40px;\n  padding: 0;\n  background-color: #26a69a;\n  border-radius: 50%;\n  transition: .3s;\n  cursor: pointer;\n  vertical-align: middle;\n}\n\n.btn-floating:hover {\n  background-color: #26a69a;\n}\n\n.btn-floating:before {\n  border-radius: 0;\n}\n\n.btn-floating.btn-large {\n  width: 56px;\n  height: 56px;\n}\n\n.btn-floating.btn-large.halfway-fab {\n  bottom: -28px;\n}\n\n.btn-floating.btn-large i {\n  line-height: 56px;\n}\n\n.btn-floating.halfway-fab {\n  position: absolute;\n  right: 24px;\n  bottom: -20px;\n}\n\n.btn-floating.halfway-fab.left {\n  right: auto;\n  left: 24px;\n}\n\n.btn-floating i {\n  width: inherit;\n  display: inline-block;\n  text-align: center;\n  color: #fff;\n  font-size: 1.6rem;\n  line-height: 40px;\n}\n\nbutton.btn-floating {\n  border: none;\n}\n\n.fixed-action-btn {\n  position: fixed;\n  right: 23px;\n  bottom: 23px;\n  padding-top: 15px;\n  margin-bottom: 0;\n  z-index: 997;\n}\n\n.fixed-action-btn.active ul {\n  visibility: visible;\n}\n\n.fixed-action-btn.horizontal {\n  padding: 0 0 0 15px;\n}\n\n.fixed-action-btn.horizontal ul {\n  text-align: right;\n  right: 64px;\n  top: 50%;\n  transform: translateY(-50%);\n  height: 100%;\n  left: auto;\n  width: 500px;\n  /*width 100% only goes to width of button container */\n}\n\n.fixed-action-btn.horizontal ul li {\n  display: inline-block;\n  margin: 15px 15px 0 0;\n}\n\n.fixed-action-btn.toolbar {\n  padding: 0;\n  height: 56px;\n}\n\n.fixed-action-btn.toolbar.active > a i {\n  opacity: 0;\n}\n\n.fixed-action-btn.toolbar ul {\n  display: flex;\n  top: 0;\n  bottom: 0;\n  z-index: 1;\n}\n\n.fixed-action-btn.toolbar ul li {\n  flex: 1;\n  display: inline-block;\n  margin: 0;\n  height: 100%;\n  transition: none;\n}\n\n.fixed-action-btn.toolbar ul li a {\n  display: block;\n  overflow: hidden;\n  position: relative;\n  width: 100%;\n  height: 100%;\n  background-color: transparent;\n  box-shadow: none;\n  color: #fff;\n  line-height: 56px;\n  z-index: 1;\n}\n\n.fixed-action-btn.toolbar ul li a i {\n  line-height: inherit;\n}\n\n.fixed-action-btn ul {\n  left: 0;\n  right: 0;\n  text-align: center;\n  position: absolute;\n  bottom: 64px;\n  margin: 0;\n  visibility: hidden;\n}\n\n.fixed-action-btn ul li {\n  margin-bottom: 15px;\n}\n\n.fixed-action-btn ul a.btn-floating {\n  opacity: 0;\n}\n\n.fixed-action-btn .fab-backdrop {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: -1;\n  width: 40px;\n  height: 40px;\n  background-color: #26a69a;\n  border-radius: 50%;\n  transform: scale(0);\n}\n\n.btn-flat {\n  box-shadow: none;\n  background-color: transparent;\n  color: #343434;\n  cursor: pointer;\n  transition: background-color .2s;\n}\n\n.btn-flat:focus,\n.btn-flat:hover {\n  box-shadow: none;\n}\n\n.btn-flat:focus {\n  background-color: rgba(0, 0, 0, 0.1);\n}\n\n.btn-flat.disabled {\n  background-color: transparent !important;\n  color: #b3b3b3 !important;\n  cursor: default;\n}\n\n.btn-large {\n  height: 54px;\n  line-height: 54px;\n}\n\n.btn-large i {\n  font-size: 1.6rem;\n}\n\n.btn-block {\n  display: block;\n}\n\n.dropdown-content {\n  background-color: #fff;\n  margin: 0;\n  display: none;\n  min-width: 100px;\n  max-height: 650px;\n  overflow-y: auto;\n  opacity: 0;\n  position: absolute;\n  z-index: 999;\n  will-change: width, height;\n}\n\n.dropdown-content li {\n  clear: both;\n  color: rgba(0, 0, 0, 0.87);\n  cursor: pointer;\n  min-height: 50px;\n  line-height: 1.5rem;\n  width: 100%;\n  text-align: left;\n  text-transform: none;\n}\n\n.dropdown-content li:hover,\n.dropdown-content li.active,\n.dropdown-content li.selected {\n  background-color: #eee;\n}\n\n.dropdown-content li.active.selected {\n  background-color: #e1e1e1;\n}\n\n.dropdown-content li.divider {\n  min-height: 0;\n  height: 1px;\n}\n\n.dropdown-content li > a,\n.dropdown-content li > span {\n  font-size: 16px;\n  color: #26a69a;\n  display: block;\n  line-height: 22px;\n  padding: 14px 16px;\n}\n\n.dropdown-content li > span > label {\n  top: 1px;\n  left: 0;\n  height: 18px;\n}\n\n.dropdown-content li > a > i {\n  height: inherit;\n  line-height: inherit;\n  float: left;\n  margin: 0 24px 0 0;\n  width: 24px;\n}\n\n.input-field.col .dropdown-content [type=\"checkbox\"] + label {\n  top: 1px;\n  left: 0;\n  height: 18px;\n}\n\n.collapsible {\n  border-top: 1px solid #ddd;\n  border-right: 1px solid #ddd;\n  border-left: 1px solid #ddd;\n  margin: 0.5rem 0 1rem 0;\n}\n\n.collapsible-header {\n  display: flex;\n  cursor: pointer;\n  -webkit-tap-highlight-color: transparent;\n  line-height: 1.5;\n  padding: 1rem;\n  background-color: #fff;\n  border-bottom: 1px solid #ddd;\n}\n\n.collapsible-header i {\n  width: 2rem;\n  font-size: 1.6rem;\n  display: inline-block;\n  text-align: center;\n  margin-right: 1rem;\n}\n\n.collapsible-body {\n  display: none;\n  border-bottom: 1px solid #ddd;\n  box-sizing: border-box;\n  padding: 2rem;\n}\n\n.side-nav .collapsible,\n.side-nav.fixed .collapsible {\n  border: none;\n  box-shadow: none;\n}\n\n.side-nav .collapsible li,\n.side-nav.fixed .collapsible li {\n  padding: 0;\n}\n\n.side-nav .collapsible-header,\n.side-nav.fixed .collapsible-header {\n  background-color: transparent;\n  border: none;\n  line-height: inherit;\n  height: inherit;\n  padding: 0 16px;\n}\n\n.side-nav .collapsible-header:hover,\n.side-nav.fixed .collapsible-header:hover {\n  background-color: rgba(0, 0, 0, 0.05);\n}\n\n.side-nav .collapsible-header i,\n.side-nav.fixed .collapsible-header i {\n  line-height: inherit;\n}\n\n.side-nav .collapsible-body,\n.side-nav.fixed .collapsible-body {\n  border: 0;\n  background-color: #fff;\n}\n\n.side-nav .collapsible-body li a,\n.side-nav.fixed .collapsible-body li a {\n  padding: 0 23.5px 0 31px;\n}\n\n.collapsible.popout {\n  border: none;\n  box-shadow: none;\n}\n\n.collapsible.popout > li {\n  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n  margin: 0 24px;\n  transition: margin 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n}\n\n.collapsible.popout > li.active {\n  box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15);\n  margin: 16px 0;\n}\n\nselect:focus {\n  outline: 1px solid #c9f3ef;\n}\n\nbutton:focus {\n  outline: none;\n  background-color: #2ab7a9;\n}\n\nlabel {\n  font-size: 0.8rem;\n  color: #9e9e9e;\n}\n\n/* Text Inputs + Textarea\r\n   ========================================================================== */\n\n/* Style Placeholders */\n\n::placeholder {\n  color: #d1d1d1;\n}\n\n/* Text inputs */\n\ninput:not([type]),\ninput[type=text]:not(.browser-default),\ninput[type=password]:not(.browser-default),\ninput[type=email]:not(.browser-default),\ninput[type=url]:not(.browser-default),\ninput[type=time]:not(.browser-default),\ninput[type=date]:not(.browser-default),\ninput[type=datetime]:not(.browser-default),\ninput[type=datetime-local]:not(.browser-default),\ninput[type=tel]:not(.browser-default),\ninput[type=number]:not(.browser-default),\ninput[type=search]:not(.browser-default),\ntextarea.materialize-textarea {\n  background-color: transparent;\n  border: none;\n  border-bottom: 1px solid #9e9e9e;\n  border-radius: 0;\n  outline: none;\n  height: 3rem;\n  width: 100%;\n  font-size: 1rem;\n  margin: 0 0 20px 0;\n  padding: 0;\n  box-shadow: none;\n  box-sizing: content-box;\n  transition: all 0.3s;\n}\n\ninput:not([type]):disabled,\ninput:not([type])[readonly=\"readonly\"],\ninput[type=text]:not(.browser-default):disabled,\ninput[type=text]:not(.browser-default)[readonly=\"readonly\"],\ninput[type=password]:not(.browser-default):disabled,\ninput[type=password]:not(.browser-default)[readonly=\"readonly\"],\ninput[type=email]:not(.browser-default):disabled,\ninput[type=email]:not(.browser-default)[readonly=\"readonly\"],\ninput[type=url]:not(.browser-default):disabled,\ninput[type=url]:not(.browser-default)[readonly=\"readonly\"],\ninput[type=time]:not(.browser-default):disabled,\ninput[type=time]:not(.browser-default)[readonly=\"readonly\"],\ninput[type=date]:not(.browser-default):disabled,\ninput[type=date]:not(.browser-default)[readonly=\"readonly\"],\ninput[type=datetime]:not(.browser-default):disabled,\ninput[type=datetime]:not(.browser-default)[readonly=\"readonly\"],\ninput[type=datetime-local]:not(.browser-default):disabled,\ninput[type=datetime-local]:not(.browser-default)[readonly=\"readonly\"],\ninput[type=tel]:not(.browser-default):disabled,\ninput[type=tel]:not(.browser-default)[readonly=\"readonly\"],\ninput[type=number]:not(.browser-default):disabled,\ninput[type=number]:not(.browser-default)[readonly=\"readonly\"],\ninput[type=search]:not(.browser-default):disabled,\ninput[type=search]:not(.browser-default)[readonly=\"readonly\"],\ntextarea.materialize-textarea:disabled,\ntextarea.materialize-textarea[readonly=\"readonly\"] {\n  color: rgba(0, 0, 0, 0.42);\n  border-bottom: 1px dotted rgba(0, 0, 0, 0.42);\n}\n\ninput:not([type]):disabled + label,\ninput:not([type])[readonly=\"readonly\"] + label,\ninput[type=text]:not(.browser-default):disabled + label,\ninput[type=text]:not(.browser-default)[readonly=\"readonly\"] + label,\ninput[type=password]:not(.browser-default):disabled + label,\ninput[type=password]:not(.browser-default)[readonly=\"readonly\"] + label,\ninput[type=email]:not(.browser-default):disabled + label,\ninput[type=email]:not(.browser-default)[readonly=\"readonly\"] + label,\ninput[type=url]:not(.browser-default):disabled + label,\ninput[type=url]:not(.browser-default)[readonly=\"readonly\"] + label,\ninput[type=time]:not(.browser-default):disabled + label,\ninput[type=time]:not(.browser-default)[readonly=\"readonly\"] + label,\ninput[type=date]:not(.browser-default):disabled + label,\ninput[type=date]:not(.browser-default)[readonly=\"readonly\"] + label,\ninput[type=datetime]:not(.browser-default):disabled + label,\ninput[type=datetime]:not(.browser-default)[readonly=\"readonly\"] + label,\ninput[type=datetime-local]:not(.browser-default):disabled + label,\ninput[type=datetime-local]:not(.browser-default)[readonly=\"readonly\"] + label,\ninput[type=tel]:not(.browser-default):disabled + label,\ninput[type=tel]:not(.browser-default)[readonly=\"readonly\"] + label,\ninput[type=number]:not(.browser-default):disabled + label,\ninput[type=number]:not(.browser-default)[readonly=\"readonly\"] + label,\ninput[type=search]:not(.browser-default):disabled + label,\ninput[type=search]:not(.browser-default)[readonly=\"readonly\"] + label,\ntextarea.materialize-textarea:disabled + label,\ntextarea.materialize-textarea[readonly=\"readonly\"] + label {\n  color: rgba(0, 0, 0, 0.42);\n}\n\ninput:not([type]):focus:not([readonly]),\ninput[type=text]:not(.browser-default):focus:not([readonly]),\ninput[type=password]:not(.browser-default):focus:not([readonly]),\ninput[type=email]:not(.browser-default):focus:not([readonly]),\ninput[type=url]:not(.browser-default):focus:not([readonly]),\ninput[type=time]:not(.browser-default):focus:not([readonly]),\ninput[type=date]:not(.browser-default):focus:not([readonly]),\ninput[type=datetime]:not(.browser-default):focus:not([readonly]),\ninput[type=datetime-local]:not(.browser-default):focus:not([readonly]),\ninput[type=tel]:not(.browser-default):focus:not([readonly]),\ninput[type=number]:not(.browser-default):focus:not([readonly]),\ninput[type=search]:not(.browser-default):focus:not([readonly]),\ntextarea.materialize-textarea:focus:not([readonly]) {\n  border-bottom: 1px solid #26a69a;\n  box-shadow: 0 1px 0 0 #26a69a;\n}\n\ninput:not([type]):focus:not([readonly]) + label,\ninput[type=text]:not(.browser-default):focus:not([readonly]) + label,\ninput[type=password]:not(.browser-default):focus:not([readonly]) + label,\ninput[type=email]:not(.browser-default):focus:not([readonly]) + label,\ninput[type=url]:not(.browser-default):focus:not([readonly]) + label,\ninput[type=time]:not(.browser-default):focus:not([readonly]) + label,\ninput[type=date]:not(.browser-default):focus:not([readonly]) + label,\ninput[type=datetime]:not(.browser-default):focus:not([readonly]) + label,\ninput[type=datetime-local]:not(.browser-default):focus:not([readonly]) + label,\ninput[type=tel]:not(.browser-default):focus:not([readonly]) + label,\ninput[type=number]:not(.browser-default):focus:not([readonly]) + label,\ninput[type=search]:not(.browser-default):focus:not([readonly]) + label,\ntextarea.materialize-textarea:focus:not([readonly]) + label {\n  color: #26a69a;\n}\n\ninput:not([type]).validate + label,\ninput[type=text]:not(.browser-default).validate + label,\ninput[type=password]:not(.browser-default).validate + label,\ninput[type=email]:not(.browser-default).validate + label,\ninput[type=url]:not(.browser-default).validate + label,\ninput[type=time]:not(.browser-default).validate + label,\ninput[type=date]:not(.browser-default).validate + label,\ninput[type=datetime]:not(.browser-default).validate + label,\ninput[type=datetime-local]:not(.browser-default).validate + label,\ninput[type=tel]:not(.browser-default).validate + label,\ninput[type=number]:not(.browser-default).validate + label,\ninput[type=search]:not(.browser-default).validate + label,\ntextarea.materialize-textarea.validate + label {\n  width: 100%;\n}\n\ninput:not([type]).invalid + label:after,\ninput:not([type]).valid + label:after,\ninput[type=text]:not(.browser-default).invalid + label:after,\ninput[type=text]:not(.browser-default).valid + label:after,\ninput[type=password]:not(.browser-default).invalid + label:after,\ninput[type=password]:not(.browser-default).valid + label:after,\ninput[type=email]:not(.browser-default).invalid + label:after,\ninput[type=email]:not(.browser-default).valid + label:after,\ninput[type=url]:not(.browser-default).invalid + label:after,\ninput[type=url]:not(.browser-default).valid + label:after,\ninput[type=time]:not(.browser-default).invalid + label:after,\ninput[type=time]:not(.browser-default).valid + label:after,\ninput[type=date]:not(.browser-default).invalid + label:after,\ninput[type=date]:not(.browser-default).valid + label:after,\ninput[type=datetime]:not(.browser-default).invalid + label:after,\ninput[type=datetime]:not(.browser-default).valid + label:after,\ninput[type=datetime-local]:not(.browser-default).invalid + label:after,\ninput[type=datetime-local]:not(.browser-default).valid + label:after,\ninput[type=tel]:not(.browser-default).invalid + label:after,\ninput[type=tel]:not(.browser-default).valid + label:after,\ninput[type=number]:not(.browser-default).invalid + label:after,\ninput[type=number]:not(.browser-default).valid + label:after,\ninput[type=search]:not(.browser-default).invalid + label:after,\ninput[type=search]:not(.browser-default).valid + label:after,\ntextarea.materialize-textarea.invalid + label:after,\ntextarea.materialize-textarea.valid + label:after {\n  display: none;\n}\n\ninput:not([type]).invalid + label.active:after,\ninput:not([type]).valid + label.active:after,\ninput[type=text]:not(.browser-default).invalid + label.active:after,\ninput[type=text]:not(.browser-default).valid + label.active:after,\ninput[type=password]:not(.browser-default).invalid + label.active:after,\ninput[type=password]:not(.browser-default).valid + label.active:after,\ninput[type=email]:not(.browser-default).invalid + label.active:after,\ninput[type=email]:not(.browser-default).valid + label.active:after,\ninput[type=url]:not(.browser-default).invalid + label.active:after,\ninput[type=url]:not(.browser-default).valid + label.active:after,\ninput[type=time]:not(.browser-default).invalid + label.active:after,\ninput[type=time]:not(.browser-default).valid + label.active:after,\ninput[type=date]:not(.browser-default).invalid + label.active:after,\ninput[type=date]:not(.browser-default).valid + label.active:after,\ninput[type=datetime]:not(.browser-default).invalid + label.active:after,\ninput[type=datetime]:not(.browser-default).valid + label.active:after,\ninput[type=datetime-local]:not(.browser-default).invalid + label.active:after,\ninput[type=datetime-local]:not(.browser-default).valid + label.active:after,\ninput[type=tel]:not(.browser-default).invalid + label.active:after,\ninput[type=tel]:not(.browser-default).valid + label.active:after,\ninput[type=number]:not(.browser-default).invalid + label.active:after,\ninput[type=number]:not(.browser-default).valid + label.active:after,\ninput[type=search]:not(.browser-default).invalid + label.active:after,\ninput[type=search]:not(.browser-default).valid + label.active:after,\ntextarea.materialize-textarea.invalid + label.active:after,\ntextarea.materialize-textarea.valid + label.active:after {\n  display: block;\n}\n\n/* Validation Sass Placeholders */\n\ninput.valid:not([type]),\ninput.valid:not([type]):focus,\ninput.valid[type=text]:not(.browser-default),\ninput.valid[type=text]:not(.browser-default):focus,\ninput.valid[type=password]:not(.browser-default),\ninput.valid[type=password]:not(.browser-default):focus,\ninput.valid[type=email]:not(.browser-default),\ninput.valid[type=email]:not(.browser-default):focus,\ninput.valid[type=url]:not(.browser-default),\ninput.valid[type=url]:not(.browser-default):focus,\ninput.valid[type=time]:not(.browser-default),\ninput.valid[type=time]:not(.browser-default):focus,\ninput.valid[type=date]:not(.browser-default),\ninput.valid[type=date]:not(.browser-default):focus,\ninput.valid[type=datetime]:not(.browser-default),\ninput.valid[type=datetime]:not(.browser-default):focus,\ninput.valid[type=datetime-local]:not(.browser-default),\ninput.valid[type=datetime-local]:not(.browser-default):focus,\ninput.valid[type=tel]:not(.browser-default),\ninput.valid[type=tel]:not(.browser-default):focus,\ninput.valid[type=number]:not(.browser-default),\ninput.valid[type=number]:not(.browser-default):focus,\ninput.valid[type=search]:not(.browser-default),\ninput.valid[type=search]:not(.browser-default):focus,\ntextarea.materialize-textarea.valid,\ntextarea.materialize-textarea.valid:focus,\n.select-wrapper.valid > input.select-dropdown {\n  border-bottom: 1px solid #4CAF50;\n  box-shadow: 0 1px 0 0 #4CAF50;\n}\n\ninput.invalid:not([type]),\ninput.invalid:not([type]):focus,\ninput.invalid[type=text]:not(.browser-default),\ninput.invalid[type=text]:not(.browser-default):focus,\ninput.invalid[type=password]:not(.browser-default),\ninput.invalid[type=password]:not(.browser-default):focus,\ninput.invalid[type=email]:not(.browser-default),\ninput.invalid[type=email]:not(.browser-default):focus,\ninput.invalid[type=url]:not(.browser-default),\ninput.invalid[type=url]:not(.browser-default):focus,\ninput.invalid[type=time]:not(.browser-default),\ninput.invalid[type=time]:not(.browser-default):focus,\ninput.invalid[type=date]:not(.browser-default),\ninput.invalid[type=date]:not(.browser-default):focus,\ninput.invalid[type=datetime]:not(.browser-default),\ninput.invalid[type=datetime]:not(.browser-default):focus,\ninput.invalid[type=datetime-local]:not(.browser-default),\ninput.invalid[type=datetime-local]:not(.browser-default):focus,\ninput.invalid[type=tel]:not(.browser-default),\ninput.invalid[type=tel]:not(.browser-default):focus,\ninput.invalid[type=number]:not(.browser-default),\ninput.invalid[type=number]:not(.browser-default):focus,\ninput.invalid[type=search]:not(.browser-default),\ninput.invalid[type=search]:not(.browser-default):focus,\ntextarea.materialize-textarea.invalid,\ntextarea.materialize-textarea.invalid:focus,\n.select-wrapper.invalid > input.select-dropdown {\n  border-bottom: 1px solid #F44336;\n  box-shadow: 0 1px 0 0 #F44336;\n}\n\ninput:not([type]).valid + label:after,\ninput:not([type]):focus.valid + label:after,\ninput[type=text]:not(.browser-default).valid + label:after,\ninput[type=text]:not(.browser-default):focus.valid + label:after,\ninput[type=password]:not(.browser-default).valid + label:after,\ninput[type=password]:not(.browser-default):focus.valid + label:after,\ninput[type=email]:not(.browser-default).valid + label:after,\ninput[type=email]:not(.browser-default):focus.valid + label:after,\ninput[type=url]:not(.browser-default).valid + label:after,\ninput[type=url]:not(.browser-default):focus.valid + label:after,\ninput[type=time]:not(.browser-default).valid + label:after,\ninput[type=time]:not(.browser-default):focus.valid + label:after,\ninput[type=date]:not(.browser-default).valid + label:after,\ninput[type=date]:not(.browser-default):focus.valid + label:after,\ninput[type=datetime]:not(.browser-default).valid + label:after,\ninput[type=datetime]:not(.browser-default):focus.valid + label:after,\ninput[type=datetime-local]:not(.browser-default).valid + label:after,\ninput[type=datetime-local]:not(.browser-default):focus.valid + label:after,\ninput[type=tel]:not(.browser-default).valid + label:after,\ninput[type=tel]:not(.browser-default):focus.valid + label:after,\ninput[type=number]:not(.browser-default).valid + label:after,\ninput[type=number]:not(.browser-default):focus.valid + label:after,\ninput[type=search]:not(.browser-default).valid + label:after,\ninput[type=search]:not(.browser-default):focus.valid + label:after,\ntextarea.materialize-textarea.valid + label:after,\ntextarea.materialize-textarea:focus.valid + label:after,\n.select-wrapper.valid + label:after {\n  content: attr(data-success);\n  color: #4CAF50;\n  opacity: 1;\n  transform: translateY(9px);\n}\n\ninput:not([type]).invalid + label:after,\ninput:not([type]):focus.invalid + label:after,\ninput[type=text]:not(.browser-default).invalid + label:after,\ninput[type=text]:not(.browser-default):focus.invalid + label:after,\ninput[type=password]:not(.browser-default).invalid + label:after,\ninput[type=password]:not(.browser-default):focus.invalid + label:after,\ninput[type=email]:not(.browser-default).invalid + label:after,\ninput[type=email]:not(.browser-default):focus.invalid + label:after,\ninput[type=url]:not(.browser-default).invalid + label:after,\ninput[type=url]:not(.browser-default):focus.invalid + label:after,\ninput[type=time]:not(.browser-default).invalid + label:after,\ninput[type=time]:not(.browser-default):focus.invalid + label:after,\ninput[type=date]:not(.browser-default).invalid + label:after,\ninput[type=date]:not(.browser-default):focus.invalid + label:after,\ninput[type=datetime]:not(.browser-default).invalid + label:after,\ninput[type=datetime]:not(.browser-default):focus.invalid + label:after,\ninput[type=datetime-local]:not(.browser-default).invalid + label:after,\ninput[type=datetime-local]:not(.browser-default):focus.invalid + label:after,\ninput[type=tel]:not(.browser-default).invalid + label:after,\ninput[type=tel]:not(.browser-default):focus.invalid + label:after,\ninput[type=number]:not(.browser-default).invalid + label:after,\ninput[type=number]:not(.browser-default):focus.invalid + label:after,\ninput[type=search]:not(.browser-default).invalid + label:after,\ninput[type=search]:not(.browser-default):focus.invalid + label:after,\ntextarea.materialize-textarea.invalid + label:after,\ntextarea.materialize-textarea:focus.invalid + label:after,\n.select-wrapper.invalid + label:after {\n  content: attr(data-error);\n  color: #F44336;\n  opacity: 1;\n  transform: translateY(9px);\n}\n\ninput:not([type]) + label:after,\ninput[type=text]:not(.browser-default) + label:after,\ninput[type=password]:not(.browser-default) + label:after,\ninput[type=email]:not(.browser-default) + label:after,\ninput[type=url]:not(.browser-default) + label:after,\ninput[type=time]:not(.browser-default) + label:after,\ninput[type=date]:not(.browser-default) + label:after,\ninput[type=datetime]:not(.browser-default) + label:after,\ninput[type=datetime-local]:not(.browser-default) + label:after,\ninput[type=tel]:not(.browser-default) + label:after,\ninput[type=number]:not(.browser-default) + label:after,\ninput[type=search]:not(.browser-default) + label:after,\ntextarea.materialize-textarea + label:after,\n.select-wrapper + label:after {\n  display: block;\n  content: \"\";\n  position: absolute;\n  top: 100%;\n  left: 0;\n  opacity: 0;\n  transition: .2s opacity ease-out, .2s color ease-out;\n}\n\n.input-field {\n  position: relative;\n  margin-top: 1rem;\n}\n\n.input-field.inline {\n  display: inline-block;\n  vertical-align: middle;\n  margin-left: 5px;\n}\n\n.input-field.inline input,\n.input-field.inline .select-dropdown {\n  margin-bottom: 1rem;\n}\n\n.input-field.col label {\n  left: 0.75rem;\n}\n\n.input-field.col .prefix ~ label,\n.input-field.col .prefix ~ .validate ~ label {\n  width: calc(100% - 3rem - 1.5rem);\n}\n\n.input-field label {\n  color: #9e9e9e;\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  font-size: 1rem;\n  cursor: text;\n  transition: transform .2s ease-out;\n  transform-origin: 0% 100%;\n  text-align: initial;\n  transform: translateY(12px);\n  pointer-events: none;\n}\n\n.input-field label:not(.label-icon).active {\n  transform: translateY(-14px) scale(0.8);\n  transform-origin: 0 0;\n}\n\n.input-field .prefix {\n  position: absolute;\n  width: 3rem;\n  font-size: 2rem;\n  transition: color .2s;\n}\n\n.input-field .prefix.active {\n  color: #26a69a;\n}\n\n.input-field .prefix ~ input,\n.input-field .prefix ~ textarea,\n.input-field .prefix ~ label,\n.input-field .prefix ~ .validate ~ label,\n.input-field .prefix ~ .autocomplete-content {\n  margin-left: 3rem;\n  width: 92%;\n  width: calc(100% - 3rem);\n}\n\n.input-field .prefix ~ label {\n  margin-left: 3rem;\n}\n\n@media only screen and (max-width: 992px) {\n  .input-field .prefix ~ input {\n    width: 86%;\n    width: calc(100% - 3rem);\n  }\n}\n\n@media only screen and (max-width: 600px) {\n  .input-field .prefix ~ input {\n    width: 80%;\n    width: calc(100% - 3rem);\n  }\n}\n\n/* Search Field */\n\n.input-field input[type=search] {\n  display: block;\n  line-height: inherit;\n}\n\n.nav-wrapper .input-field input[type=search] {\n  height: inherit;\n  padding-left: 4rem;\n  width: calc(100% - 4rem);\n  border: 0;\n  box-shadow: none;\n}\n\n.input-field input[type=search]:focus {\n  background-color: #fff;\n  border: 0;\n  box-shadow: none;\n  color: #444;\n}\n\n.input-field input[type=search]:focus + label i,\n.input-field input[type=search]:focus ~ .mdi-navigation-close,\n.input-field input[type=search]:focus ~ .material-icons {\n  color: #444;\n}\n\n.input-field input[type=search] + label {\n  left: 1rem;\n}\n\n.input-field input[type=search] ~ .mdi-navigation-close,\n.input-field input[type=search] ~ .material-icons {\n  position: absolute;\n  top: 0;\n  right: 1rem;\n  color: transparent;\n  cursor: pointer;\n  font-size: 2rem;\n  transition: .3s color;\n}\n\n/* Textarea */\n\ntextarea {\n  width: 100%;\n  height: 3rem;\n  background-color: transparent;\n}\n\ntextarea.materialize-textarea {\n  overflow-y: hidden;\n  /* prevents scroll bar flash */\n  padding: .8rem 0 1.6rem 0;\n  /* prevents text jump on Enter keypress */\n  resize: none;\n  min-height: 3rem;\n}\n\ntextarea.materialize-textarea.validate + label {\n  height: 100%;\n}\n\ntextarea.materialize-textarea.validate + label::after {\n  top: calc(100% - 12px);\n}\n\ntextarea.materialize-textarea.validate + label:not(.label-icon).active {\n  transform: translateY(-25px);\n}\n\n.hiddendiv {\n  display: none;\n  white-space: pre-wrap;\n  word-wrap: break-word;\n  overflow-wrap: break-word;\n  /* future version of deprecated 'word-wrap' */\n  padding-top: 1.2rem;\n  /* prevents text jump on Enter keypress */\n  position: absolute;\n  top: 0;\n}\n\n/* Autocomplete */\n\n.autocomplete-content {\n  margin-top: -20px;\n  margin-bottom: 20px;\n  display: block;\n  opacity: 1;\n  position: static;\n}\n\n.autocomplete-content li .highlight {\n  color: #444;\n}\n\n.autocomplete-content li img {\n  height: 40px;\n  width: 40px;\n  margin: 5px 15px;\n}\n\n/* Radio Buttons\r\n   ========================================================================== */\n\n[type=\"radio\"]:not(:checked),\n[type=\"radio\"]:checked {\n  position: absolute;\n  opacity: 0;\n  pointer-events: none;\n}\n\n[type=\"radio\"]:not(:checked) + label,\n[type=\"radio\"]:checked + label {\n  position: relative;\n  padding-left: 35px;\n  cursor: pointer;\n  display: inline-block;\n  height: 25px;\n  line-height: 25px;\n  font-size: 1rem;\n  transition: .28s ease;\n  user-select: none;\n}\n\n[type=\"radio\"] + label:before,\n[type=\"radio\"] + label:after {\n  content: '';\n  position: absolute;\n  left: 0;\n  top: 0;\n  margin: 4px;\n  width: 16px;\n  height: 16px;\n  z-index: 0;\n  transition: .28s ease;\n}\n\n/* Unchecked styles */\n\n[type=\"radio\"]:not(:checked) + label:before,\n[type=\"radio\"]:not(:checked) + label:after,\n[type=\"radio\"]:checked + label:before,\n[type=\"radio\"]:checked + label:after,\n[type=\"radio\"].with-gap:checked + label:before,\n[type=\"radio\"].with-gap:checked + label:after {\n  border-radius: 50%;\n}\n\n[type=\"radio\"]:not(:checked) + label:before,\n[type=\"radio\"]:not(:checked) + label:after {\n  border: 2px solid #5a5a5a;\n}\n\n[type=\"radio\"]:not(:checked) + label:after {\n  transform: scale(0);\n}\n\n/* Checked styles */\n\n[type=\"radio\"]:checked + label:before {\n  border: 2px solid transparent;\n}\n\n[type=\"radio\"]:checked + label:after,\n[type=\"radio\"].with-gap:checked + label:before,\n[type=\"radio\"].with-gap:checked + label:after {\n  border: 2px solid #26a69a;\n}\n\n[type=\"radio\"]:checked + label:after,\n[type=\"radio\"].with-gap:checked + label:after {\n  background-color: #26a69a;\n}\n\n[type=\"radio\"]:checked + label:after {\n  transform: scale(1.02);\n}\n\n/* Radio With gap */\n\n[type=\"radio\"].with-gap:checked + label:after {\n  transform: scale(0.5);\n}\n\n/* Focused styles */\n\n[type=\"radio\"].tabbed:focus + label:before {\n  box-shadow: 0 0 0 10px rgba(0, 0, 0, 0.1);\n}\n\n/* Disabled Radio With gap */\n\n[type=\"radio\"].with-gap:disabled:checked + label:before {\n  border: 2px solid rgba(0, 0, 0, 0.42);\n}\n\n[type=\"radio\"].with-gap:disabled:checked + label:after {\n  border: none;\n  background-color: rgba(0, 0, 0, 0.42);\n}\n\n/* Disabled style */\n\n[type=\"radio\"]:disabled:not(:checked) + label:before,\n[type=\"radio\"]:disabled:checked + label:before {\n  background-color: transparent;\n  border-color: rgba(0, 0, 0, 0.42);\n}\n\n[type=\"radio\"]:disabled + label {\n  color: rgba(0, 0, 0, 0.42);\n}\n\n[type=\"radio\"]:disabled:not(:checked) + label:before {\n  border-color: rgba(0, 0, 0, 0.42);\n}\n\n[type=\"radio\"]:disabled:checked + label:after {\n  background-color: rgba(0, 0, 0, 0.42);\n  border-color: #949494;\n}\n\n/* Checkboxes\r\n   ========================================================================== */\n\n/* CUSTOM CSS CHECKBOXES */\n\nform p {\n  margin-bottom: 10px;\n  text-align: left;\n}\n\nform p:last-child {\n  margin-bottom: 0;\n}\n\n/* Remove default checkbox */\n\n[type=\"checkbox\"]:not(:checked),\n[type=\"checkbox\"]:checked {\n  position: absolute;\n  opacity: 0;\n  pointer-events: none;\n}\n\n[type=\"checkbox\"] {\n  /* checkbox aspect */\n}\n\n[type=\"checkbox\"] + label {\n  position: relative;\n  padding-left: 35px;\n  cursor: pointer;\n  display: inline-block;\n  height: 25px;\n  line-height: 25px;\n  font-size: 1rem;\n  user-select: none;\n}\n\n[type=\"checkbox\"] + label:before,\n[type=\"checkbox\"]:not(.filled-in) + label:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 18px;\n  height: 18px;\n  z-index: 0;\n  border: 2px solid #5a5a5a;\n  border-radius: 1px;\n  margin-top: 2px;\n  transition: .2s;\n}\n\n[type=\"checkbox\"]:not(.filled-in) + label:after {\n  border: 0;\n  transform: scale(0);\n}\n\n[type=\"checkbox\"]:not(:checked):disabled + label:before {\n  border: none;\n  background-color: rgba(0, 0, 0, 0.42);\n}\n\n[type=\"checkbox\"].tabbed:focus + label:after {\n  transform: scale(1);\n  border: 0;\n  border-radius: 50%;\n  box-shadow: 0 0 0 10px rgba(0, 0, 0, 0.1);\n  background-color: rgba(0, 0, 0, 0.1);\n}\n\n[type=\"checkbox\"]:checked + label:before {\n  top: -4px;\n  left: -5px;\n  width: 12px;\n  height: 22px;\n  border-top: 2px solid transparent;\n  border-left: 2px solid transparent;\n  border-right: 2px solid #26a69a;\n  border-bottom: 2px solid #26a69a;\n  transform: rotate(40deg);\n  backface-visibility: hidden;\n  transform-origin: 100% 100%;\n}\n\n[type=\"checkbox\"]:checked:disabled + label:before {\n  border-right: 2px solid rgba(0, 0, 0, 0.42);\n  border-bottom: 2px solid rgba(0, 0, 0, 0.42);\n}\n\n/* Indeterminate checkbox */\n\n[type=\"checkbox\"]:indeterminate + label:before {\n  top: -11px;\n  left: -12px;\n  width: 10px;\n  height: 22px;\n  border-top: none;\n  border-left: none;\n  border-right: 2px solid #26a69a;\n  border-bottom: none;\n  transform: rotate(90deg);\n  backface-visibility: hidden;\n  transform-origin: 100% 100%;\n}\n\n[type=\"checkbox\"]:indeterminate:disabled + label:before {\n  border-right: 2px solid rgba(0, 0, 0, 0.42);\n  background-color: transparent;\n}\n\n[type=\"checkbox\"].filled-in + label:after {\n  border-radius: 2px;\n}\n\n[type=\"checkbox\"].filled-in + label:before,\n[type=\"checkbox\"].filled-in + label:after {\n  content: '';\n  left: 0;\n  position: absolute;\n  /* .1s delay is for check animation */\n  transition: border .25s, background-color .25s, width .20s .1s, height .20s .1s, top .20s .1s, left .20s .1s;\n  z-index: 1;\n}\n\n[type=\"checkbox\"].filled-in:not(:checked) + label:before {\n  width: 0;\n  height: 0;\n  border: 3px solid transparent;\n  left: 6px;\n  top: 10px;\n  transform: rotateZ(37deg);\n  transform-origin: 100% 100%;\n}\n\n[type=\"checkbox\"].filled-in:not(:checked) + label:after {\n  height: 20px;\n  width: 20px;\n  background-color: transparent;\n  border: 2px solid #5a5a5a;\n  top: 0px;\n  z-index: 0;\n}\n\n[type=\"checkbox\"].filled-in:checked + label:before {\n  top: 0;\n  left: 1px;\n  width: 8px;\n  height: 13px;\n  border-top: 2px solid transparent;\n  border-left: 2px solid transparent;\n  border-right: 2px solid #fff;\n  border-bottom: 2px solid #fff;\n  transform: rotateZ(37deg);\n  transform-origin: 100% 100%;\n}\n\n[type=\"checkbox\"].filled-in:checked + label:after {\n  top: 0;\n  width: 20px;\n  height: 20px;\n  border: 2px solid #26a69a;\n  background-color: #26a69a;\n  z-index: 0;\n}\n\n[type=\"checkbox\"].filled-in.tabbed:focus + label:after {\n  border-radius: 2px;\n  border-color: #5a5a5a;\n  background-color: rgba(0, 0, 0, 0.1);\n}\n\n[type=\"checkbox\"].filled-in.tabbed:checked:focus + label:after {\n  border-radius: 2px;\n  background-color: #26a69a;\n  border-color: #26a69a;\n}\n\n[type=\"checkbox\"].filled-in:disabled:not(:checked) + label:before {\n  background-color: transparent;\n  border: 2px solid transparent;\n}\n\n[type=\"checkbox\"].filled-in:disabled:not(:checked) + label:after {\n  border-color: transparent;\n  background-color: #949494;\n}\n\n[type=\"checkbox\"].filled-in:disabled:checked + label:before {\n  background-color: transparent;\n}\n\n[type=\"checkbox\"].filled-in:disabled:checked + label:after {\n  background-color: #949494;\n  border-color: #949494;\n}\n\n/* Switch\r\n   ========================================================================== */\n\n.switch,\n.switch * {\n  -webkit-tap-highlight-color: transparent;\n  user-select: none;\n}\n\n.switch label {\n  cursor: pointer;\n}\n\n.switch label input[type=checkbox] {\n  opacity: 0;\n  width: 0;\n  height: 0;\n}\n\n.switch label input[type=checkbox]:checked + .lever {\n  background-color: #84c7c1;\n}\n\n.switch label input[type=checkbox]:checked + .lever:before,\n.switch label input[type=checkbox]:checked + .lever:after {\n  left: 18px;\n}\n\n.switch label input[type=checkbox]:checked + .lever:after {\n  background-color: #26a69a;\n}\n\n.switch label .lever {\n  content: \"\";\n  display: inline-block;\n  position: relative;\n  width: 36px;\n  height: 14px;\n  background-color: rgba(0, 0, 0, 0.38);\n  border-radius: 15px;\n  margin-right: 10px;\n  transition: background 0.3s ease;\n  vertical-align: middle;\n  margin: 0 16px;\n}\n\n.switch label .lever:before,\n.switch label .lever:after {\n  content: \"\";\n  position: absolute;\n  display: inline-block;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  left: 0;\n  top: -3px;\n  transition: left 0.3s ease, background .3s ease, box-shadow 0.1s ease, transform .1s ease;\n}\n\n.switch label .lever:before {\n  background-color: rgba(38, 166, 154, 0.15);\n}\n\n.switch label .lever:after {\n  background-color: #F1F1F1;\n  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\n}\n\ninput[type=checkbox]:checked:not(:disabled) ~ .lever:active::before,\ninput[type=checkbox]:checked:not(:disabled).tabbed:focus ~ .lever::before {\n  transform: scale(2.4);\n  background-color: rgba(38, 166, 154, 0.15);\n}\n\ninput[type=checkbox]:not(:disabled) ~ .lever:active:before,\ninput[type=checkbox]:not(:disabled).tabbed:focus ~ .lever::before {\n  transform: scale(2.4);\n  background-color: rgba(0, 0, 0, 0.08);\n}\n\n.switch input[type=checkbox][disabled] + .lever {\n  cursor: default;\n  background-color: rgba(0, 0, 0, 0.12);\n}\n\n.switch label input[type=checkbox][disabled] + .lever:after,\n.switch label input[type=checkbox][disabled]:checked + .lever:after {\n  background-color: #949494;\n}\n\n/* Select Field\r\n   ========================================================================== */\n\nselect {\n  display: none;\n}\n\nselect.browser-default {\n  display: block;\n}\n\nselect {\n  background-color: rgba(255, 255, 255, 0.9);\n  width: 100%;\n  padding: 5px;\n  border: 1px solid #f2f2f2;\n  border-radius: 2px;\n  height: 3rem;\n}\n\n.input-field > select {\n  display: block;\n  position: absolute;\n  width: 0;\n  pointer-events: none;\n  height: 0;\n  top: 0;\n  left: 0;\n  opacity: 0;\n}\n\n.select-label {\n  position: absolute;\n}\n\n.select-wrapper {\n  position: relative;\n}\n\n.select-wrapper.valid + label,\n.select-wrapper.invalid + label {\n  width: 100%;\n  pointer-events: none;\n}\n\n.select-wrapper input.select-dropdown {\n  position: relative;\n  cursor: pointer;\n  background-color: transparent;\n  border: none;\n  border-bottom: 1px solid #9e9e9e;\n  outline: none;\n  height: 3rem;\n  line-height: 3rem;\n  width: 100%;\n  font-size: 1rem;\n  margin: 0 0 20px 0;\n  padding: 0;\n  display: block;\n  user-select: none;\n}\n\n.select-wrapper span.caret {\n  color: initial;\n  position: absolute;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  height: 10px;\n  margin: auto 0;\n  font-size: 10px;\n  line-height: 10px;\n}\n\n.select-wrapper + label {\n  position: absolute;\n  top: -26px;\n  font-size: 0.8rem;\n}\n\nselect:disabled {\n  color: rgba(0, 0, 0, 0.42);\n}\n\n.select-wrapper.disabled span.caret,\n.select-wrapper.disabled + label {\n  color: rgba(0, 0, 0, 0.42);\n}\n\n.select-wrapper input.select-dropdown:disabled {\n  color: rgba(0, 0, 0, 0.42);\n  cursor: default;\n  user-select: none;\n}\n\n.select-wrapper i {\n  color: rgba(0, 0, 0, 0.3);\n}\n\n.select-dropdown li.disabled,\n.select-dropdown li.disabled > span,\n.select-dropdown li.optgroup {\n  color: rgba(0, 0, 0, 0.3);\n  background-color: transparent;\n}\n\n.select-dropdown.dropdown-content li.active {\n  background-color: transparent;\n}\n\n.select-dropdown.dropdown-content li:hover {\n  background-color: rgba(0, 0, 0, 0.06);\n}\n\n.select-dropdown.dropdown-content li.selected {\n  background-color: rgba(0, 0, 0, 0.03);\n}\n\n.prefix ~ .select-wrapper {\n  margin-left: 3rem;\n  width: 92%;\n  width: calc(100% - 3rem);\n}\n\n.prefix ~ label {\n  margin-left: 3rem;\n}\n\n.select-dropdown li img {\n  height: 40px;\n  width: 40px;\n  margin: 5px 15px;\n  float: right;\n}\n\n.select-dropdown li.optgroup {\n  border-top: 1px solid #eee;\n}\n\n.select-dropdown li.optgroup.selected > span {\n  color: rgba(0, 0, 0, 0.7);\n}\n\n.select-dropdown li.optgroup > span {\n  color: rgba(0, 0, 0, 0.4);\n}\n\n.select-dropdown li.optgroup ~ li.optgroup-option {\n  padding-left: 1rem;\n}\n\n/* File Input\r\n   ========================================================================== */\n\n.file-field {\n  position: relative;\n}\n\n.file-field .file-path-wrapper {\n  overflow: hidden;\n  padding-left: 10px;\n}\n\n.file-field input.file-path {\n  width: 100%;\n}\n\n.file-field .btn,\n.file-field .btn-large {\n  float: left;\n  height: 3rem;\n  line-height: 3rem;\n}\n\n.file-field span {\n  cursor: pointer;\n}\n\n.file-field input[type=file] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n  width: 100%;\n  margin: 0;\n  padding: 0;\n  font-size: 20px;\n  cursor: pointer;\n  opacity: 0;\n  filter: alpha(opacity=0);\n}\n\n.file-field input[type=file]::-webkit-file-upload-button {\n  display: none;\n}\n\n/* Range\r\n   ========================================================================== */\n\n.range-field {\n  position: relative;\n}\n\ninput[type=range],\ninput[type=range] + .thumb {\n  cursor: pointer;\n}\n\ninput[type=range] {\n  position: relative;\n  background-color: transparent;\n  border: none;\n  outline: none;\n  width: 100%;\n  margin: 15px 0;\n  padding: 0;\n}\n\ninput[type=range]:focus {\n  outline: none;\n}\n\ninput[type=range] + .thumb {\n  position: absolute;\n  top: 10px;\n  left: 0;\n  border: none;\n  height: 0;\n  width: 0;\n  border-radius: 50%;\n  background-color: #26a69a;\n  margin-left: 7px;\n  transform-origin: 50% 50%;\n  transform: rotate(-45deg);\n}\n\ninput[type=range] + .thumb .value {\n  display: block;\n  width: 30px;\n  text-align: center;\n  color: #26a69a;\n  font-size: 0;\n  transform: rotate(45deg);\n}\n\ninput[type=range] + .thumb.active {\n  border-radius: 50% 50% 50% 0;\n}\n\ninput[type=range] + .thumb.active .value {\n  color: #fff;\n  margin-left: -1px;\n  margin-top: 8px;\n  font-size: 10px;\n}\n\ninput[type=range] {\n  -webkit-appearance: none;\n}\n\ninput[type=range]::-webkit-slider-runnable-track {\n  height: 3px;\n  background: #c2c0c2;\n  border: none;\n}\n\ninput[type=range]::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  border: none;\n  height: 14px;\n  width: 14px;\n  border-radius: 50%;\n  background-color: #26a69a;\n  transform-origin: 50% 50%;\n  margin: -5px 0 0 0;\n  transition: .3s;\n}\n\ninput[type=range]:focus::-webkit-slider-runnable-track {\n  background: #ccc;\n}\n\ninput[type=range] {\n  /* fix for FF unable to apply focus style bug  */\n  border: 1px solid white;\n  /*required for proper track sizing in FF*/\n}\n\ninput[type=range]::-moz-range-track {\n  height: 3px;\n  background: #ddd;\n  border: none;\n}\n\ninput[type=range]::-moz-range-thumb {\n  border: none;\n  height: 14px;\n  width: 14px;\n  border-radius: 50%;\n  background: #26a69a;\n  margin-top: -5px;\n}\n\ninput[type=range]:-moz-focusring {\n  outline: 1px solid #fff;\n  outline-offset: -1px;\n}\n\ninput[type=range]:focus::-moz-range-track {\n  background: #ccc;\n}\n\ninput[type=range]::-ms-track {\n  height: 3px;\n  background: transparent;\n  border-color: transparent;\n  border-width: 6px 0;\n  /*remove default tick marks*/\n  color: transparent;\n}\n\ninput[type=range]::-ms-fill-lower {\n  background: #777;\n}\n\ninput[type=range]::-ms-fill-upper {\n  background: #ddd;\n}\n\ninput[type=range]::-ms-thumb {\n  border: none;\n  height: 14px;\n  width: 14px;\n  border-radius: 50%;\n  background: #26a69a;\n}\n\ninput[type=range]:focus::-ms-fill-lower {\n  background: #888;\n}\n\ninput[type=range]:focus::-ms-fill-upper {\n  background: #ccc;\n}\n\n/** Import theme styles */\n\n/** Colors */\n\n/** Fonts */\n\n/** Font Sizes */\n\n/** Box Model  */\n\n/** Modified Grid */\n\n/** Flow Text  */\n\n/** Gradients */\n\nhtml {\n  font-size: 18px;\n}\n\nhtml[data-text-size=\"medium\"] {\n  font-size: 20px;\n}\n\nhtml[data-text-size=\"large\"] {\n  font-size: 24px;\n}\n\n@media only screen and (max-width: 600px) {\n  html {\n    font-size: 16px;\n  }\n}\n\nbody {\n  font-family: \"Montserrat\", sans-serif;\n}\n\n* {\n  box-sizing: border-box;\n}\n\n@media only screen and (min-width: 601px) {\n  .container {\n    width: 95%;\n  }\n}\n\n@media only screen and (min-width: 993px) {\n  .container {\n    width: 90%;\n  }\n}\n\n.content {\n  position: relative;\n  z-index: 3;\n}\n\n.flex {\n  display: flex;\n}\n\n@media only screen and (max-width: 600px) {\n  .flex {\n    flex-wrap: wrap;\n  }\n}\n\n.flex-center {\n  align-items: center;\n}\n\n.flex-end {\n  justify-content: flex-end;\n}\n\n.flex-bottom {\n  align-items: flex-end;\n}\n\n.flex-wrap {\n  flex-wrap: wrap;\n}\n\n.flex-grid {\n  display: flex;\n  flex-wrap: wrap;\n}\n\n.flex-grid .flex-item {\n  padding: 10px;\n}\n\n.flex-grid.s1x .flex-item {\n  display: flex;\n  position: relative;\n}\n\n@media only screen and (max-width: 600px) {\n  .flex-grid.s1x .flex-item {\n    width: 100%;\n  }\n}\n\n.flex-grid.m2x .flex-item {\n  display: flex;\n  position: relative;\n}\n\n@media only screen and (min-width: 601px) {\n  .flex-grid.m2x .flex-item {\n    width: 50%;\n  }\n}\n\n.space-between {\n  justify-content: space-between;\n}\n\n.space-evenly {\n  justify-content: space-evenly;\n}\n\n.mega-link.mega-link {\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 5;\n}\n\n@media only screen and (max-width: 600px) {\n  .row .col.xs12 {\n    width: 100%;\n  }\n}\n\nimg {\n  max-width: 100%;\n  height: auto;\n}\n\n.page .main {\n  margin-bottom: 2rem;\n}\n\nh1 {\n  font-size: 35px;\n  text-transform: uppercase;\n  text-align: center;\n  color: #006993;\n}\n\nh2 {\n  font-size: 30px;\n  text-transform: uppercase;\n  text-align: center;\n  color: #006993;\n}\n\nh3 {\n  font-size: 20px;\n  color: #006993;\n}\n\na {\n  color: #006993;\n}\n\n.screen-reader-text {\n  clip: rect(1px, 1px, 1px, 1px);\n  clip-path: polygon(0 0, 0 0, 0 0, 0 0);\n  position: absolute !important;\n  white-space: nowrap;\n  height: 1px;\n  width: 1px;\n  overflow: hidden;\n}\n\n.screen-reader-text:focus {\n  clip: auto;\n  clip-path: none;\n  display: block;\n  height: auto;\n  left: 5px;\n  top: 5px;\n  width: auto;\n  z-index: 100000;\n  /* Above WP toolbar. */\n}\n\n.a11y-tools-trigger-wrapper {\n  position: absolute;\n  right: 5%;\n  top: 5px;\n  transition: top 0.3s ease;\n}\n\n@media only screen and (max-width: 600px) {\n  .a11y-tools-active .a11y-tools-trigger-wrapper {\n    top: 125px;\n  }\n}\n\n.a11y-tools-trigger-wrapper input:focus + label {\n  outline: #404040 auto 5px;\n}\n\n.a11y-tools-trigger-wrapper label {\n  display: block;\n  background: #000;\n  border-radius: 100%;\n  width: 50px;\n  height: 50px;\n  text-align: center;\n  cursor: pointer;\n  transition: background 0.3s ease;\n}\n\n.a11y-tools-trigger-wrapper label i {\n  position: absolute;\n  left: 0;\n  width: 100%;\n  top: 50%;\n  transform: translateY(-50%);\n  color: #fff;\n}\n\n.a11y-tools-trigger-wrapper label span {\n  display: none;\n}\n\n.a11y-tools-trigger-wrapper label:hover {\n  background: #004560;\n}\n\nhtml[data-contrast=\"true\"] .a11y-tools-trigger-wrapper label {\n  border: 3px solid #fff;\n}\n\nhtml[data-contrast=\"true\"] .a11y-tools-trigger-wrapper label:hover {\n  background: #fff;\n}\n\nhtml[data-contrast=\"true\"] .a11y-tools-trigger-wrapper label:hover i {\n  color: #000;\n}\n\n.a11y-tools {\n  height: 50px;\n  overflow: hidden;\n  transition: height 0.3s ease;\n  position: relative;\n}\n\n@media only screen and (max-width: 600px) {\n  .a11y-tools {\n    height: 0;\n  }\n\n  .a11y-tools-active .a11y-tools {\n    height: 110px;\n  }\n}\n\nhtml[data-contrast=\"true\"] .a11y-tools {\n  border-bottom: 1px solid #fff;\n}\n\n@media only screen and (min-width: 993px) {\n  .a11y-tools .container {\n    padding-right: 15px;\n  }\n}\n\n.a11y-tools fieldset {\n  border: none;\n  padding: 0;\n  margin: 0;\n}\n\n@media only screen and (max-width: 600px) {\n  .a11y-tools fieldset {\n    padding-bottom: 10px;\n  }\n}\n\n.a11y-tools fieldset legend,\n.a11y-tools fieldset > div {\n  display: block;\n  float: left;\n  padding: 0 3px;\n}\n\n.a11y-tools fieldset legend {\n  width: 65px;\n  font-size: 12px;\n  padding-top: 8px;\n}\n\n@media only screen and (max-width: 600px) {\n  .a11y-tools fieldset legend {\n    display: none;\n  }\n}\n\n.a11y-tools fieldset label {\n  display: block;\n  text-indent: -100em;\n  overflow: hidden;\n  width: 50px;\n  height: 50px;\n  position: relative;\n  background: #dcd8d8;\n  transition: background 0.3s ease;\n  cursor: pointer;\n}\n\n.a11y-tools fieldset label::after {\n  position: absolute;\n  left: 0;\n  width: 100%;\n  color: #000;\n}\n\n.a11y-tools fieldset label:hover {\n  background: #909090;\n}\n\n.a11y-tools fieldset label:hover::after {\n  color: #fff;\n}\n\nhtml[data-contrast=\"true\"] .a11y-tools fieldset label {\n  background: #000;\n  border: 1px solid #fff;\n}\n\nhtml[data-contrast=\"true\"] .a11y-tools fieldset label::after {\n  color: #fff;\n}\n\nhtml[data-contrast=\"true\"] .a11y-tools fieldset label:hover,\nhtml[data-contrast=\"true\"] .a11y-tools fieldset label:focus {\n  background: #fff;\n}\n\nhtml[data-contrast=\"true\"] .a11y-tools fieldset label:hover::after,\nhtml[data-contrast=\"true\"] .a11y-tools fieldset label:focus::after {\n  color: #000;\n}\n\n.a11y-tools fieldset input[type=\"radio\"]:checked + label {\n  background: #c9d9e3;\n}\n\n.a11y-tools fieldset input[type=\"radio\"]:checked + label::after {\n  color: #fff;\n}\n\nhtml[data-contrast=\"true\"] .a11y-tools fieldset input[type=\"radio\"]:checked + label {\n  background: #404040;\n}\n\n.a11y-tools fieldset input[type=\"radio\"]:focus + label {\n  outline: #404040 auto 5px;\n}\n\nhtml[data-contrast=\"true\"] .a11y-tools fieldset input[type=\"radio\"]:focus + label {\n  outline: #fff auto 5px;\n}\n\n.a11y-tools fieldset input[type=\"checkbox\"]:checked + label {\n  background: #c9d9e3;\n}\n\n.a11y-tools fieldset input[type=\"checkbox\"]:checked + label::after {\n  background-image: url(\"../images/icon-contrast-inverse.svg\");\n}\n\nhtml[data-contrast=\"true\"] .a11y-tools fieldset input[type=\"checkbox\"]:checked + label {\n  background: #404040;\n}\n\nhtml[data-contrast=\"true\"] .a11y-tools fieldset input[type=\"checkbox\"]:checked + label:hover,\nhtml[data-contrast=\"true\"] .a11y-tools fieldset input[type=\"checkbox\"]:checked + label:focus {\n  background: #909090;\n}\n\n.a11y-tools fieldset input[type=\"checkbox\"]:focus + label {\n  outline: #404040 auto 5px;\n}\n\nhtml[data-contrast=\"true\"] .a11y-tools fieldset input[type=\"checkbox\"]:focus + label {\n  outline: #fff auto 5px;\n}\n\n.a11y-tools fieldset.toggle-contrast label::after {\n  content: '';\n  top: 0;\n  height: 100%;\n  background: url(\"../images/icon-contrast.svg\") no-repeat 50% 50%;\n}\n\n.a11y-tools fieldset.text-size label::after {\n  content: 'A';\n  top: 50%;\n  transform: translateY(-50%);\n  text-indent: 0;\n  text-align: center;\n  transition: color 0.3s ease;\n  speak: none;\n}\n\n.a11y-tools fieldset.text-size div[class*=\"default-\"] label::after {\n  font-size: 18px;\n}\n\n.a11y-tools fieldset.text-size div[class*=\"medium-\"] label::after {\n  font-size: 24px;\n}\n\n.a11y-tools fieldset.text-size div[class*=\"large-\"] label::after {\n  font-size: 27px;\n}\n\n.a11y-tools .search-form {\n  margin-left: 6px;\n  width: auto;\n  align-self: flex-start;\n}\n\n.a11y-tools .search-form .label {\n  float: left;\n  width: 45px;\n  white-space: normal;\n  padding-top: 8px;\n  font-size: 12px;\n  line-height: 1.5;\n  font-family: \"Montserrat\", sans-serif;\n  font-weight: normal;\n}\n\n.a11y-tools .search-form .search-field {\n  float: left;\n  overflow: hidden;\n  transition: all 0.3s ease;\n  width: 0;\n  padding: 0;\n}\n\n.a11y-tools .search-form.active .search-field {\n  width: 200px;\n  padding: 0 10px;\n}\n\n@media only screen and (max-width: 600px) {\n  .a11y-tools .search-form .search-field {\n    width: 250px;\n    padding: 0 10px;\n  }\n}\n\n@media only screen and (max-width: 600px) {\n  .a11y-tools .search-form {\n    margin-left: 0;\n  }\n\n  .a11y-tools .search-form .label {\n    display: none;\n  }\n\n  .a11y-tools .search-form .search-field {\n    width: 225px;\n  }\n}\n\nhtml[data-contrast=\"true\"] .a11y-tools .search-form .label {\n  color: #fff;\n}\n\nhtml[data-contrast=\"true\"] {\n  background: #000;\n  color: #fff;\n}\n\nhtml[data-contrast=\"true\"] .banner .navbar,\nhtml[data-contrast=\"true\"] .page-footer .footer-copyright {\n  background: #000;\n  border-top: 1px solid #fff;\n  border-bottom: 1px solid #fff;\n}\n\nhtml[data-contrast=\"true\"] .navbar-menu li.current-page-ancestor,\nhtml[data-contrast=\"true\"] .navbar-menu li.current-menu-item,\nhtml[data-contrast=\"true\"] .navbar-menu li:hover,\nhtml[data-contrast=\"true\"] .navbar-menu li:focus,\nhtml[data-contrast=\"true\"] .navbar-menu li.hover {\n  background: #404040;\n  border-right: 1px solid #fff;\n  border-left: 1px solid #fff;\n}\n\nhtml[data-contrast=\"true\"] .btn,\nhtml[data-contrast=\"true\"] .btn-large,\nhtml[data-contrast=\"true\"] .social-icons li a,\nhtml[data-contrast=\"true\"] .page-footer .widget_nav_menu .menu li a {\n  background: #000;\n  border-color: #fff;\n}\n\nhtml[data-contrast=\"true\"] .btn:hover,\nhtml[data-contrast=\"true\"] .btn-large:hover,\nhtml[data-contrast=\"true\"] .btn:focus,\nhtml[data-contrast=\"true\"] .btn-large:focus,\nhtml[data-contrast=\"true\"] .social-icons li a:hover,\nhtml[data-contrast=\"true\"] .social-icons li a:focus,\nhtml[data-contrast=\"true\"] .page-footer .widget_nav_menu .menu li a:hover,\nhtml[data-contrast=\"true\"] .page-footer .widget_nav_menu .menu li a:focus {\n  background: #fff;\n  color: #000;\n}\n\nhtml[data-contrast=\"true\"] select,\nhtml[data-contrast=\"true\"] input[type=\"text\"] {\n  border-color: #fff;\n  background: #000;\n  color: #fff;\n}\n\nhtml[data-contrast=\"true\"] h1,\nhtml[data-contrast=\"true\"] h2,\nhtml[data-contrast=\"true\"] h3,\nhtml[data-contrast=\"true\"] h4,\nhtml[data-contrast=\"true\"] h5,\nhtml[data-contrast=\"true\"] h6,\nhtml[data-contrast=\"true\"] .h1,\nhtml[data-contrast=\"true\"] .h2,\nhtml[data-contrast=\"true\"] .h3,\nhtml[data-contrast=\"true\"] .h4,\nhtml[data-contrast=\"true\"] .h5,\nhtml[data-contrast=\"true\"] .h6,\nhtml[data-contrast=\"true\"] a {\n  color: #fff;\n}\n\nhtml[data-contrast=\"true\"] .banner .logo img {\n  background-size: contain;\n  display: block;\n  box-sizing: border-box;\n  padding-left: 100%;\n  padding-top: 27.65%;\n  overflow: hidden;\n}\n\nhtml[data-contrast=\"true\"] .events-list.events-list time,\nhtml[data-contrast=\"true\"] .single-mc-events time {\n  background: #000;\n  border-color: #404040;\n}\n\n.btn,\n.btn-large {\n  background-color: #f68026;\n  background-image: linear-gradient(to bottom right, transparent 0, transparent 50%, #e06609 50%, #e06609 100%);\n  padding: 1em;\n  text-align: center;\n  margin: 1em 0;\n  line-height: 28px;\n  width: 300px;\n  height: 60px;\n  font-size: 18px;\n}\n\n.btn:hover,\n.btn-large:hover {\n  background-color: #e06609;\n}\n\n.btn:active,\n.btn-large:active,\n.btn:focus,\n.btn-large:focus {\n  border: 1px solid black;\n}\n\n/** Search form */\n\n/**\n * WordPress Generated Classes\n * @see http://codex.wordpress.org/CSS#WordPress_Generated_Classes\n */\n\n/** Media alignment */\n\n.alignnone {\n  margin-left: 0;\n  margin-right: 0;\n  max-width: 100%;\n  height: auto;\n}\n\n.aligncenter {\n  display: block;\n  margin: 1rem auto;\n  height: auto;\n}\n\n.alignleft,\n.alignright {\n  margin-bottom: 1rem;\n  height: auto;\n}\n\n@media (min-width: 30rem) {\n  .alignleft {\n    float: left;\n    margin-right: 1rem;\n  }\n\n  .alignright {\n    float: right;\n    margin-left: 1rem;\n  }\n}\n\n/** Captions */\n\n/** Text meant only for screen readers */\n\n.screen-reader-text {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  border: 0;\n  color: #000;\n  background: #fff;\n}\n\n.nav-primary {\n  background: #006993;\n  font-weight: 300;\n}\n\n.nav-primary ul {\n  display: flex;\n  justify-content: space-around;\n}\n\n.unity-link {\n  display: inline-block;\n  max-width: 120px;\n  max-height: 23px;\n  float: right;\n}\n\n.svg-unity-logo {\n  width: 100%;\n  height: auto;\n  max-height: 23px;\n  display: inline-block;\n  vertical-align: middle;\n}\n\n.svg-unity-logo path {\n  fill: #fff;\n}\n\n#menu-social-menu {\n  display: flex;\n  justify-content: center;\n}\n\n#menu-social-menu li a {\n  display: block;\n  position: relative;\n  height: 40px;\n  width: 40px;\n  margin: 0 7px;\n}\n\n#menu-social-menu li a::before {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 40px;\n  height: 40px;\n  background-repeat: no-repeat;\n  background-size: contain;\n  background-position: center;\n}\n\n#menu-social-menu li.facebook-footer a::before {\n  background-image: url(\"../images/facebook.svg\");\n}\n\n#menu-social-menu li.instagram-footer a::before {\n  background-image: url(\"../images/instagram.svg\");\n}\n\n#menu-social-menu li.twitter-footer a::before {\n  background-image: url(\"../images/twitter.svg\");\n}\n\nheader {\n  display: flex;\n  justify-content: space-around;\n  align-items: center;\n}\n\nfooter {\n  background: #006993;\n  color: #fff;\n  padding: 5px 1em;\n  font-weight: 300;\n  padding-top: 1.5em;\n}\n\nfooter .m4:nth-of-type(2) {\n  text-align: center;\n}\n\nfooter .m4:nth-of-type(3) {\n  text-align: right;\n}\n\nfooter .row {\n  margin-bottom: 0;\n}\n\nfooter .textwidget p {\n  margin: 0;\n}\n\n.footer-copyright {\n  background: #004560;\n  color: #fff;\n  font-weight: 300;\n  font-size: 15px;\n  padding: 5px 1em;\n}\n\n.footer-copyright a {\n  color: white;\n}\n\n.footer-copyright .row {\n  margin-bottom: 0;\n}\n\n.footer-copyright .m4:nth-of-type(2) {\n  text-align: center;\n}\n\nbody#tinymce {\n  margin: 12px !important;\n}\n\n.home .hero {\n  text-align: center;\n  margin-bottom: 2em;\n}\n\n.home .hero img {\n  width: 100%;\n  height: 400px;\n  object-fit: cover;\n}\n\n.home .hero .btn:nth-of-type(2),\n.home .hero .btn-large:nth-of-type(2) {\n  background-color: #006993;\n  background-image: linear-gradient(to bottom right, transparent 0, transparent 50%, #004560 50%, #004560 100%);\n}\n\n.home .hero .btn:nth-of-type(2):hover,\n.home .hero .btn-large:nth-of-type(2):hover {\n  background-color: #004560;\n}\n\n.home .hero .btn:nth-of-type(3),\n.home .hero .btn-large:nth-of-type(3) {\n  background-color: #b7d331;\n  background-image: linear-gradient(to bottom right, transparent 0, transparent 50%, #95ac25 50%, #95ac25 100%);\n}\n\n.home .hero .btn:nth-of-type(3):hover,\n.home .hero .btn-large:nth-of-type(3):hover {\n  background-color: #95ac25;\n}\n\n.home .hero .btn:nth-of-type(4),\n.home .hero .btn-large:nth-of-type(4) {\n  background-color: #e3b831;\n  background-image: linear-gradient(to bottom right, transparent 0, transparent 50%, #c69d1b 50%, #c69d1b 100%);\n}\n\n.home .hero .btn:nth-of-type(4):hover,\n.home .hero .btn-large:nth-of-type(4):hover {\n  background-color: #c69d1b;\n}\n\n.home .services {\n  background: #c9d9e3;\n  padding: 2em 0;\n}\n\n.home .services .service-item {\n  height: 250px;\n  position: relative;\n  background-size: cover;\n  margin-bottom: 1em;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);\n}\n\n.home .services .service-item h3 {\n  background: #fff;\n  padding: 1em;\n  margin: 0;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  text-align: center;\n}\n\n.home .overview h2 {\n  text-align: left;\n}\n\n","// Utility Color Classes\r\n\r\n//.success {\r\n//\r\n//}\r\n\r\n// Google Color Palette defined: http://www.google.com/design/spec/style/color.html\r\n\r\n\r\n$materialize-red: (\r\n  \"base\":       #e51c23,\r\n  \"lighten-5\":  #fdeaeb,\r\n  \"lighten-4\":  #f8c1c3,\r\n  \"lighten-3\":  #f3989b,\r\n  \"lighten-2\":  #ee6e73,\r\n  \"lighten-1\":  #ea454b,\r\n  \"darken-1\":   #d0181e,\r\n  \"darken-2\":   #b9151b,\r\n  \"darken-3\":   #a21318,\r\n  \"darken-4\":   #8b1014,\r\n);\r\n\r\n$red: (\r\n  \"base\":       #F44336,\r\n  \"lighten-5\":  #FFEBEE,\r\n  \"lighten-4\":  #FFCDD2,\r\n  \"lighten-3\":  #EF9A9A,\r\n  \"lighten-2\":  #E57373,\r\n  \"lighten-1\":  #EF5350,\r\n  \"darken-1\":   #E53935,\r\n  \"darken-2\":   #D32F2F,\r\n  \"darken-3\":   #C62828,\r\n  \"darken-4\":   #B71C1C,\r\n  \"accent-1\":    #FF8A80,\r\n  \"accent-2\":    #FF5252,\r\n  \"accent-3\":    #FF1744,\r\n  \"accent-4\":    #D50000\r\n);\r\n\r\n$pink: (\r\n  \"base\":       #e91e63,\r\n  \"lighten-5\":  #fce4ec,\r\n  \"lighten-4\":  #f8bbd0,\r\n  \"lighten-3\":  #f48fb1,\r\n  \"lighten-2\":  #f06292,\r\n  \"lighten-1\":  #ec407a,\r\n  \"darken-1\":   #d81b60,\r\n  \"darken-2\":   #c2185b,\r\n  \"darken-3\":   #ad1457,\r\n  \"darken-4\":   #880e4f,\r\n  \"accent-1\":    #ff80ab,\r\n  \"accent-2\":    #ff4081,\r\n  \"accent-3\":    #f50057,\r\n  \"accent-4\":    #c51162\r\n);\r\n\r\n$purple: (\r\n  \"base\":       #9c27b0,\r\n  \"lighten-5\":  #f3e5f5,\r\n  \"lighten-4\":  #e1bee7,\r\n  \"lighten-3\":  #ce93d8,\r\n  \"lighten-2\":  #ba68c8,\r\n  \"lighten-1\":  #ab47bc,\r\n  \"darken-1\":   #8e24aa,\r\n  \"darken-2\":   #7b1fa2,\r\n  \"darken-3\":   #6a1b9a,\r\n  \"darken-4\":   #4a148c,\r\n  \"accent-1\":    #ea80fc,\r\n  \"accent-2\":    #e040fb,\r\n  \"accent-3\":    #d500f9,\r\n  \"accent-4\":    #aa00ff\r\n);\r\n\r\n$deep-purple: (\r\n  \"base\":       #673ab7,\r\n  \"lighten-5\":  #ede7f6,\r\n  \"lighten-4\":  #d1c4e9,\r\n  \"lighten-3\":  #b39ddb,\r\n  \"lighten-2\":  #9575cd,\r\n  \"lighten-1\":  #7e57c2,\r\n  \"darken-1\":   #5e35b1,\r\n  \"darken-2\":   #512da8,\r\n  \"darken-3\":   #4527a0,\r\n  \"darken-4\":   #311b92,\r\n  \"accent-1\":    #b388ff,\r\n  \"accent-2\":    #7c4dff,\r\n  \"accent-3\":    #651fff,\r\n  \"accent-4\":    #6200ea\r\n);\r\n\r\n$indigo: (\r\n  \"base\":       #3f51b5,\r\n  \"lighten-5\":  #e8eaf6,\r\n  \"lighten-4\":  #c5cae9,\r\n  \"lighten-3\":  #9fa8da,\r\n  \"lighten-2\":  #7986cb,\r\n  \"lighten-1\":  #5c6bc0,\r\n  \"darken-1\":   #3949ab,\r\n  \"darken-2\":   #303f9f,\r\n  \"darken-3\":   #283593,\r\n  \"darken-4\":   #1a237e,\r\n  \"accent-1\":    #8c9eff,\r\n  \"accent-2\":    #536dfe,\r\n  \"accent-3\":    #3d5afe,\r\n  \"accent-4\":    #304ffe\r\n);\r\n\r\n$blue: (\r\n  \"base\":       #2196F3,\r\n  \"lighten-5\":  #E3F2FD,\r\n  \"lighten-4\":  #BBDEFB,\r\n  \"lighten-3\":  #90CAF9,\r\n  \"lighten-2\":  #64B5F6,\r\n  \"lighten-1\":  #42A5F5,\r\n  \"darken-1\":   #1E88E5,\r\n  \"darken-2\":   #1976D2,\r\n  \"darken-3\":   #1565C0,\r\n  \"darken-4\":   #0D47A1,\r\n  \"accent-1\":    #82B1FF,\r\n  \"accent-2\":    #448AFF,\r\n  \"accent-3\":    #2979FF,\r\n  \"accent-4\":    #2962FF\r\n);\r\n\r\n$light-blue: (\r\n  \"base\":       #03a9f4,\r\n  \"lighten-5\":  #e1f5fe,\r\n  \"lighten-4\":  #b3e5fc,\r\n  \"lighten-3\":  #81d4fa,\r\n  \"lighten-2\":  #4fc3f7,\r\n  \"lighten-1\":  #29b6f6,\r\n  \"darken-1\":   #039be5,\r\n  \"darken-2\":   #0288d1,\r\n  \"darken-3\":   #0277bd,\r\n  \"darken-4\":   #01579b,\r\n  \"accent-1\":    #80d8ff,\r\n  \"accent-2\":    #40c4ff,\r\n  \"accent-3\":    #00b0ff,\r\n  \"accent-4\":    #0091ea\r\n);\r\n\r\n$cyan: (\r\n  \"base\":       #00bcd4,\r\n  \"lighten-5\":  #e0f7fa,\r\n  \"lighten-4\":  #b2ebf2,\r\n  \"lighten-3\":  #80deea,\r\n  \"lighten-2\":  #4dd0e1,\r\n  \"lighten-1\":  #26c6da,\r\n  \"darken-1\":   #00acc1,\r\n  \"darken-2\":   #0097a7,\r\n  \"darken-3\":   #00838f,\r\n  \"darken-4\":   #006064,\r\n  \"accent-1\":    #84ffff,\r\n  \"accent-2\":    #18ffff,\r\n  \"accent-3\":    #00e5ff,\r\n  \"accent-4\":    #00b8d4\r\n);\r\n\r\n$teal: (\r\n  \"base\":       #009688,\r\n  \"lighten-5\":  #e0f2f1,\r\n  \"lighten-4\":  #b2dfdb,\r\n  \"lighten-3\":  #80cbc4,\r\n  \"lighten-2\":  #4db6ac,\r\n  \"lighten-1\":  #26a69a,\r\n  \"darken-1\":   #00897b,\r\n  \"darken-2\":   #00796b,\r\n  \"darken-3\":   #00695c,\r\n  \"darken-4\":   #004d40,\r\n  \"accent-1\":    #a7ffeb,\r\n  \"accent-2\":    #64ffda,\r\n  \"accent-3\":    #1de9b6,\r\n  \"accent-4\":    #00bfa5\r\n);\r\n\r\n$green: (\r\n  \"base\":       #4CAF50,\r\n  \"lighten-5\":  #E8F5E9,\r\n  \"lighten-4\":  #C8E6C9,\r\n  \"lighten-3\":  #A5D6A7,\r\n  \"lighten-2\":  #81C784,\r\n  \"lighten-1\":  #66BB6A,\r\n  \"darken-1\":   #43A047,\r\n  \"darken-2\":   #388E3C,\r\n  \"darken-3\":   #2E7D32,\r\n  \"darken-4\":   #1B5E20,\r\n  \"accent-1\":    #B9F6CA,\r\n  \"accent-2\":    #69F0AE,\r\n  \"accent-3\":    #00E676,\r\n  \"accent-4\":    #00C853\r\n);\r\n\r\n$light-green: (\r\n  \"base\":       #8bc34a,\r\n  \"lighten-5\":  #f1f8e9,\r\n  \"lighten-4\":  #dcedc8,\r\n  \"lighten-3\":  #c5e1a5,\r\n  \"lighten-2\":  #aed581,\r\n  \"lighten-1\":  #9ccc65,\r\n  \"darken-1\":   #7cb342,\r\n  \"darken-2\":   #689f38,\r\n  \"darken-3\":   #558b2f,\r\n  \"darken-4\":   #33691e,\r\n  \"accent-1\":    #ccff90,\r\n  \"accent-2\":    #b2ff59,\r\n  \"accent-3\":    #76ff03,\r\n  \"accent-4\":    #64dd17\r\n);\r\n\r\n$lime: (\r\n  \"base\":       #cddc39,\r\n  \"lighten-5\":  #f9fbe7,\r\n  \"lighten-4\":  #f0f4c3,\r\n  \"lighten-3\":  #e6ee9c,\r\n  \"lighten-2\":  #dce775,\r\n  \"lighten-1\":  #d4e157,\r\n  \"darken-1\":   #c0ca33,\r\n  \"darken-2\":   #afb42b,\r\n  \"darken-3\":   #9e9d24,\r\n  \"darken-4\":   #827717,\r\n  \"accent-1\":    #f4ff81,\r\n  \"accent-2\":    #eeff41,\r\n  \"accent-3\":    #c6ff00,\r\n  \"accent-4\":    #aeea00\r\n);\r\n\r\n$yellow: (\r\n  \"base\":       #ffeb3b,\r\n  \"lighten-5\":  #fffde7,\r\n  \"lighten-4\":  #fff9c4,\r\n  \"lighten-3\":  #fff59d,\r\n  \"lighten-2\":  #fff176,\r\n  \"lighten-1\":  #ffee58,\r\n  \"darken-1\":   #fdd835,\r\n  \"darken-2\":   #fbc02d,\r\n  \"darken-3\":   #f9a825,\r\n  \"darken-4\":   #f57f17,\r\n  \"accent-1\":    #ffff8d,\r\n  \"accent-2\":    #ffff00,\r\n  \"accent-3\":    #ffea00,\r\n  \"accent-4\":    #ffd600\r\n);\r\n\r\n$amber: (\r\n  \"base\":       #ffc107,\r\n  \"lighten-5\":  #fff8e1,\r\n  \"lighten-4\":  #ffecb3,\r\n  \"lighten-3\":  #ffe082,\r\n  \"lighten-2\":  #ffd54f,\r\n  \"lighten-1\":  #ffca28,\r\n  \"darken-1\":   #ffb300,\r\n  \"darken-2\":   #ffa000,\r\n  \"darken-3\":   #ff8f00,\r\n  \"darken-4\":   #ff6f00,\r\n  \"accent-1\":    #ffe57f,\r\n  \"accent-2\":    #ffd740,\r\n  \"accent-3\":    #ffc400,\r\n  \"accent-4\":    #ffab00\r\n);\r\n\r\n$orange: (\r\n  \"base\":       #ff9800,\r\n  \"lighten-5\":  #fff3e0,\r\n  \"lighten-4\":  #ffe0b2,\r\n  \"lighten-3\":  #ffcc80,\r\n  \"lighten-2\":  #ffb74d,\r\n  \"lighten-1\":  #ffa726,\r\n  \"darken-1\":   #fb8c00,\r\n  \"darken-2\":   #f57c00,\r\n  \"darken-3\":   #ef6c00,\r\n  \"darken-4\":   #e65100,\r\n  \"accent-1\":    #ffd180,\r\n  \"accent-2\":    #ffab40,\r\n  \"accent-3\":    #ff9100,\r\n  \"accent-4\":    #ff6d00\r\n);\r\n\r\n$deep-orange: (\r\n  \"base\":       #ff5722,\r\n  \"lighten-5\":  #fbe9e7,\r\n  \"lighten-4\":  #ffccbc,\r\n  \"lighten-3\":  #ffab91,\r\n  \"lighten-2\":  #ff8a65,\r\n  \"lighten-1\":  #ff7043,\r\n  \"darken-1\":   #f4511e,\r\n  \"darken-2\":   #e64a19,\r\n  \"darken-3\":   #d84315,\r\n  \"darken-4\":   #bf360c,\r\n  \"accent-1\":    #ff9e80,\r\n  \"accent-2\":    #ff6e40,\r\n  \"accent-3\":    #ff3d00,\r\n  \"accent-4\":    #dd2c00\r\n);\r\n\r\n$brown: (\r\n  \"base\":       #795548,\r\n  \"lighten-5\":  #efebe9,\r\n  \"lighten-4\":  #d7ccc8,\r\n  \"lighten-3\":  #bcaaa4,\r\n  \"lighten-2\":  #a1887f,\r\n  \"lighten-1\":  #8d6e63,\r\n  \"darken-1\":   #6d4c41,\r\n  \"darken-2\":   #5d4037,\r\n  \"darken-3\":   #4e342e,\r\n  \"darken-4\":   #3e2723\r\n);\r\n\r\n$blue-grey: (\r\n  \"base\":       #607d8b,\r\n  \"lighten-5\":  #eceff1,\r\n  \"lighten-4\":  #cfd8dc,\r\n  \"lighten-3\":  #b0bec5,\r\n  \"lighten-2\":  #90a4ae,\r\n  \"lighten-1\":  #78909c,\r\n  \"darken-1\":   #546e7a,\r\n  \"darken-2\":   #455a64,\r\n  \"darken-3\":   #37474f,\r\n  \"darken-4\":   #263238\r\n);\r\n\r\n$grey: (\r\n  \"base\":       #9e9e9e,\r\n  \"lighten-5\":  #fafafa,\r\n  \"lighten-4\":  #f5f5f5,\r\n  \"lighten-3\":  #eeeeee,\r\n  \"lighten-2\":  #e0e0e0,\r\n  \"lighten-1\":  #bdbdbd,\r\n  \"darken-1\":   #757575,\r\n  \"darken-2\":   #616161,\r\n  \"darken-3\":   #424242,\r\n  \"darken-4\":   #212121\r\n);\r\n\r\n$shades: (\r\n  \"black\":        #000000,\r\n  \"white\":        #FFFFFF,\r\n  \"transparent\":  transparent\r\n);\r\n\r\n$colors: (\r\n  \"materialize-red\": $materialize-red,\r\n  \"red\": $red,\r\n  \"pink\": $pink,\r\n  \"purple\": $purple,\r\n  \"deep-purple\": $deep-purple,\r\n  \"indigo\": $indigo,\r\n  \"blue\": $blue,\r\n  \"light-blue\": $light-blue,\r\n  \"cyan\": $cyan,\r\n  \"teal\": $teal,\r\n  \"green\": $green,\r\n  \"light-green\": $light-green,\r\n  \"lime\": $lime,\r\n  \"yellow\": $yellow,\r\n  \"amber\": $amber,\r\n  \"orange\": $orange,\r\n  \"deep-orange\": $deep-orange,\r\n  \"brown\": $brown,\r\n  \"blue-grey\": $blue-grey,\r\n  \"grey\": $grey,\r\n  \"shades\": $shades\r\n) !default;\r\n\r\n\r\n// Color Classes\r\n\r\n@each $color_name, $color in $colors {\r\n  @each $color_type, $color_value in $color {\r\n    @if $color_type == \"base\" {\r\n      .#{$color_name} {\r\n        background-color: $color_value !important;\r\n      }\r\n      .#{$color_name}-text {\r\n        color: $color_value !important;\r\n      }\r\n    }\r\n    @else if $color_name != \"shades\" {\r\n      .#{$color_name}.#{$color_type} {\r\n        background-color: $color_value !important;\r\n      }\r\n      .#{$color_name}-text.text-#{$color_type} {\r\n        color: $color_value !important;\r\n      }\r\n    }\r\n  }\r\n}\r\n\r\n// Shade classes\r\n@each $color, $color_value in $shades {\r\n  .#{$color} {\r\n    background-color: $color_value !important;\r\n  }\r\n  .#{$color}-text {\r\n    color: $color_value !important;\r\n  }\r\n}\r\n\r\n\r\n// usage: color(\"name_of_color\", \"type_of_color\")\r\n// to avoid to repeating map-get($colors, ...)\r\n\r\n@function color($color, $type) {\r\n  @if map-has-key($colors, $color) {\r\n    $curr_color: map-get($colors, $color);\r\n    @if map-has-key($curr_color, $type) {\r\n      @return map-get($curr_color, $type);\r\n    }\r\n  }\r\n  @warn \"Unknown `#{$color}` - `#{$type}` in $colors.\";\r\n  @return null;\r\n}\r\n\r\n","/*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */\r\n\r\n/**\r\n * 1. Set default font family to sans-serif.\r\n * 2. Prevent iOS and IE text size adjust after device orientation change,\r\n *    without disabling user zoom.\r\n */\r\n\r\nhtml {\r\n  font-family: sans-serif; /* 1 */\r\n  -ms-text-size-adjust: 100%; /* 2 */\r\n  -webkit-text-size-adjust: 100%; /* 2 */\r\n}\r\n\r\n/**\r\n * Remove default margin.\r\n */\r\n\r\nbody {\r\n  margin: 0;\r\n}\r\n\r\n/* HTML5 display definitions\r\n   ========================================================================== */\r\n\r\n/**\r\n * Correct `block` display not defined for any HTML5 element in IE 8/9.\r\n * Correct `block` display not defined for `details` or `summary` in IE 10/11\r\n * and Firefox.\r\n * Correct `block` display not defined for `main` in IE 11.\r\n */\r\n\r\narticle,\r\naside,\r\ndetails,\r\nfigcaption,\r\nfigure,\r\nfooter,\r\nheader,\r\nhgroup,\r\nmain,\r\nmenu,\r\nnav,\r\nsection,\r\nsummary {\r\n  display: block;\r\n}\r\n\r\n/**\r\n * 1. Correct `inline-block` display not defined in IE 8/9.\r\n * 2. Normalize vertical alignment of `progress` in Chrome, Firefox, and Opera.\r\n */\r\n\r\naudio,\r\ncanvas,\r\nprogress,\r\nvideo {\r\n  display: inline-block; /* 1 */\r\n  vertical-align: baseline; /* 2 */\r\n}\r\n\r\n/**\r\n * Prevent modern browsers from displaying `audio` without controls.\r\n * Remove excess height in iOS 5 devices.\r\n */\r\n\r\naudio:not([controls]) {\r\n  display: none;\r\n  height: 0;\r\n}\r\n\r\n/**\r\n * Address `[hidden]` styling not present in IE 8/9/10.\r\n * Hide the `template` element in IE 8/9/10/11, Safari, and Firefox < 22.\r\n */\r\n\r\n[hidden],\r\ntemplate {\r\n  display: none;\r\n}\r\n\r\n/* Links\r\n   ========================================================================== */\r\n\r\n/**\r\n * Remove the gray background color from active links in IE 10.\r\n */\r\n\r\na {\r\n  background-color: transparent;\r\n}\r\n\r\n/**\r\n * Improve readability of focused elements when they are also in an\r\n * active/hover state.\r\n */\r\n\r\na:active,\r\na:hover {\r\n  outline: 0;\r\n}\r\n\r\n/* Text-level semantics\r\n   ========================================================================== */\r\n\r\n/**\r\n * Address styling not present in IE 8/9/10/11, Safari, and Chrome.\r\n */\r\n\r\nabbr[title] {\r\n  border-bottom: 1px dotted;\r\n}\r\n\r\n/**\r\n * Address style set to `bolder` in Firefox 4+, Safari, and Chrome.\r\n */\r\n\r\nb,\r\nstrong {\r\n  font-weight: bold;\r\n}\r\n\r\n/**\r\n * Address styling not present in Safari and Chrome.\r\n */\r\n\r\ndfn {\r\n  font-style: italic;\r\n}\r\n\r\n/**\r\n * Address variable `h1` font-size and margin within `section` and `article`\r\n * contexts in Firefox 4+, Safari, and Chrome.\r\n */\r\n\r\nh1 {\r\n  font-size: 2em;\r\n  margin: 0.67em 0;\r\n}\r\n\r\n/**\r\n * Address styling not present in IE 8/9.\r\n */\r\n\r\nmark {\r\n  background: #ff0;\r\n  color: #000;\r\n}\r\n\r\n/**\r\n * Address inconsistent and variable font size in all browsers.\r\n */\r\n\r\nsmall {\r\n  font-size: 80%;\r\n}\r\n\r\n/**\r\n * Prevent `sub` and `sup` affecting `line-height` in all browsers.\r\n */\r\n\r\nsub,\r\nsup {\r\n  font-size: 75%;\r\n  line-height: 0;\r\n  position: relative;\r\n  vertical-align: baseline;\r\n}\r\n\r\nsup {\r\n  top: -0.5em;\r\n}\r\n\r\nsub {\r\n  bottom: -0.25em;\r\n}\r\n\r\n/* Embedded content\r\n   ========================================================================== */\r\n\r\n/**\r\n * Remove border when inside `a` element in IE 8/9/10.\r\n */\r\n\r\nimg {\r\n  border: 0;\r\n}\r\n\r\n/**\r\n * Correct overflow not hidden in IE 9/10/11.\r\n */\r\n\r\nsvg:not(:root) {\r\n  overflow: hidden;\r\n}\r\n\r\n/* Grouping content\r\n   ========================================================================== */\r\n\r\n/**\r\n * Address margin not present in IE 8/9 and Safari.\r\n */\r\n\r\nfigure {\r\n  margin: 1em 40px;\r\n}\r\n\r\n/**\r\n * Address differences between Firefox and other browsers.\r\n */\r\n\r\nhr {\r\n  box-sizing: content-box;\r\n  height: 0;\r\n}\r\n\r\n/**\r\n * Contain overflow in all browsers.\r\n */\r\n\r\npre {\r\n  overflow: auto;\r\n}\r\n\r\n/**\r\n * Address odd `em`-unit font size rendering in all browsers.\r\n */\r\n\r\ncode,\r\nkbd,\r\npre,\r\nsamp {\r\n  font-family: monospace, monospace;\r\n  font-size: 1em;\r\n}\r\n\r\n/* Forms\r\n   ========================================================================== */\r\n\r\n/**\r\n * Known limitation: by default, Chrome and Safari on OS X allow very limited\r\n * styling of `select`, unless a `border` property is set.\r\n */\r\n\r\n/**\r\n * 1. Correct color not being inherited.\r\n *    Known issue: affects color of disabled elements.\r\n * 2. Correct font properties not being inherited.\r\n * 3. Address margins set differently in Firefox 4+, Safari, and Chrome.\r\n */\r\n\r\nbutton,\r\ninput,\r\noptgroup,\r\nselect,\r\ntextarea {\r\n  color: inherit; /* 1 */\r\n  font: inherit; /* 2 */\r\n  margin: 0; /* 3 */\r\n}\r\n\r\n/**\r\n * Address `overflow` set to `hidden` in IE 8/9/10/11.\r\n */\r\n\r\nbutton {\r\n  overflow: visible;\r\n}\r\n\r\n/**\r\n * Address inconsistent `text-transform` inheritance for `button` and `select`.\r\n * All other form control elements do not inherit `text-transform` values.\r\n * Correct `button` style inheritance in Firefox, IE 8/9/10/11, and Opera.\r\n * Correct `select` style inheritance in Firefox.\r\n */\r\n\r\nbutton,\r\nselect {\r\n  text-transform: none;\r\n}\r\n\r\n/**\r\n * 1. Avoid the WebKit bug in Android 4.0.* where (2) destroys native `audio`\r\n *    and `video` controls.\r\n * 2. Correct inability to style clickable `input` types in iOS.\r\n * 3. Improve usability and consistency of cursor style between image-type\r\n *    `input` and others.\r\n */\r\n\r\nbutton,\r\nhtml input[type=\"button\"], /* 1 */\r\ninput[type=\"reset\"],\r\ninput[type=\"submit\"] {\r\n  -webkit-appearance: button; /* 2 */\r\n  cursor: pointer; /* 3 */\r\n}\r\n\r\n/**\r\n * Re-set default cursor for disabled elements.\r\n */\r\n\r\nbutton[disabled],\r\nhtml input[disabled] {\r\n  cursor: default;\r\n}\r\n\r\n/**\r\n * Remove inner padding and border in Firefox 4+.\r\n */\r\n\r\nbutton::-moz-focus-inner,\r\ninput::-moz-focus-inner {\r\n  border: 0;\r\n  padding: 0;\r\n}\r\n\r\n/**\r\n * Address Firefox 4+ setting `line-height` on `input` using `!important` in\r\n * the UA stylesheet.\r\n */\r\n\r\ninput {\r\n  line-height: normal;\r\n}\r\n\r\n/**\r\n * It's recommended that you don't attempt to style these elements.\r\n * Firefox's implementation doesn't respect box-sizing, padding, or width.\r\n *\r\n * 1. Address box sizing set to `content-box` in IE 8/9/10.\r\n * 2. Remove excess padding in IE 8/9/10.\r\n */\r\n\r\ninput[type=\"checkbox\"],\r\ninput[type=\"radio\"] {\r\n  box-sizing: border-box; /* 1 */\r\n  padding: 0; /* 2 */\r\n}\r\n\r\n/**\r\n * Fix the cursor style for Chrome's increment/decrement buttons. For certain\r\n * `font-size` values of the `input`, it causes the cursor style of the\r\n * decrement button to change from `default` to `text`.\r\n */\r\n\r\ninput[type=\"number\"]::-webkit-inner-spin-button,\r\ninput[type=\"number\"]::-webkit-outer-spin-button {\r\n  height: auto;\r\n}\r\n\r\n/**\r\n * 1. Address `appearance` set to `searchfield` in Safari and Chrome.\r\n * 2. Address `box-sizing` set to `border-box` in Safari and Chrome.\r\n */\r\n\r\ninput[type=\"search\"] {\r\n  -webkit-appearance: textfield; /* 1 */\r\n  box-sizing: content-box; /* 2 */\r\n}\r\n\r\n/**\r\n * Remove inner padding and search cancel button in Safari and Chrome on OS X.\r\n * Safari (but not Chrome) clips the cancel button when the search input has\r\n * padding (and `textfield` appearance).\r\n */\r\n\r\ninput[type=\"search\"]::-webkit-search-cancel-button,\r\ninput[type=\"search\"]::-webkit-search-decoration {\r\n  -webkit-appearance: none;\r\n}\r\n\r\n/**\r\n * Define consistent border, margin, and padding.\r\n */\r\n\r\nfieldset {\r\n  border: 1px solid #c0c0c0;\r\n  margin: 0 2px;\r\n  padding: 0.35em 0.625em 0.75em;\r\n}\r\n\r\n/**\r\n * 1. Correct `color` not being inherited in IE 8/9/10/11.\r\n * 2. Remove padding so people aren't caught out if they zero out fieldsets.\r\n */\r\n\r\nlegend {\r\n  border: 0; /* 1 */\r\n  padding: 0; /* 2 */\r\n}\r\n\r\n/**\r\n * Remove default vertical scrollbar in IE 8/9/10/11.\r\n */\r\n\r\ntextarea {\r\n  overflow: auto;\r\n}\r\n\r\n/**\r\n * Don't inherit the `font-weight` (applied by a rule above).\r\n * NOTE: the default cannot safely be changed in Chrome and Safari on OS X.\r\n */\r\n\r\noptgroup {\r\n  font-weight: bold;\r\n}\r\n\r\n/* Tables\r\n   ========================================================================== */\r\n\r\n/**\r\n * Remove most spacing between table cells.\r\n */\r\n\r\ntable {\r\n  border-collapse: collapse;\r\n  border-spacing: 0;\r\n}\r\n\r\ntd,\r\nth {\r\n  padding: 0;\r\n}\r\n","//Default styles\r\n\r\nhtml {\r\n box-sizing: border-box;\r\n}\r\n*, *:before, *:after {\r\n box-sizing: inherit;\r\n}\r\n\r\nbody {\r\n  // display: flex;\r\n  // min-height: 100vh;\r\n  // flex-direction: column;\r\n}\r\n\r\nmain {\r\n  // flex: 1 0 auto;\r\n}\r\n\r\nul {\r\n  &:not(.browser-default) {\r\n    padding-left: 0;\r\n    list-style-type: none;\r\n\r\n    & > li {\r\n      list-style-type: none;\r\n    }\r\n  }\r\n}\r\n\r\na {\r\n\tcolor: $link-color;\r\n\ttext-decoration: none;\r\n\r\n  // Gets rid of tap active state\r\n  -webkit-tap-highlight-color: transparent;\r\n}\r\n\r\n\r\n// Positioning\r\n.valign-wrapper {\r\n  display: flex;\r\n  align-items: center;\r\n}\r\n\r\n\r\n// classic clearfix\r\n.clearfix {\r\n  clear: both;\r\n}\r\n\r\n\r\n// Z-levels\r\n.z-depth-0 {\r\n  box-shadow: none !important;\r\n}\r\n.z-depth-1 {\r\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);\r\n}\r\n.z-depth-1-half {\r\n  box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 7px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -1px rgba(0, 0, 0, 0.2);\r\n}\r\n.z-depth-2 {\r\n  box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.3);\r\n}\r\n.z-depth-3 {\r\n  box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.3);\r\n}\r\n.z-depth-4 {\r\n  box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.3);\r\n}\r\n.z-depth-5 {\r\n  box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.3);\r\n}\r\n\r\n.hoverable {\r\n  transition: box-shadow .25s;\r\n\r\n  &:hover {\r\n    box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);\r\n  }\r\n}\r\n\r\n// Dividers\r\n\r\n.divider {\r\n  height: 1px;\r\n  overflow: hidden;\r\n  background-color: color(\"grey\", \"lighten-2\");\r\n}\r\n\r\n\r\n//  Blockquote\r\n\r\nblockquote {\r\n  margin: 20px 0;\r\n  padding-left: 1.5rem;\r\n  border-left: 5px solid $primary-color;\r\n}\r\n\r\n// Icon Styles\r\n\r\ni {\r\n  line-height: inherit;\r\n\r\n  &.left {\r\n    float: left;\r\n    margin-right: 15px;\r\n  }\r\n  &.right {\r\n    float: right;\r\n    margin-left: 15px;\r\n  }\r\n  &.tiny {\r\n    font-size: 1rem;\r\n  }\r\n  &.small {\r\n    font-size: 2rem;\r\n  }\r\n  &.medium {\r\n    font-size: 4rem;\r\n  }\r\n  &.large {\r\n    font-size: 6rem;\r\n  }\r\n}\r\n\r\n// Images\r\nimg.responsive-img,\r\nvideo.responsive-video {\r\n  max-width: 100%;\r\n  height: auto;\r\n}\r\n\r\n\r\n// Pagination\r\n\r\n.pagination {\r\n\r\n  li {\r\n    display: inline-block;\r\n    border-radius: 2px;\r\n    text-align: center;\r\n    vertical-align: top;\r\n    height: 30px;\r\n\r\n    a {\r\n      color: #444;\r\n      display: inline-block;\r\n      font-size: 1.2rem;\r\n      padding: 0 10px;\r\n      line-height: 30px;\r\n    }\r\n\r\n    &.active a { color: #fff; }\r\n\r\n    &.active { background-color: $primary-color; }\r\n\r\n    &.disabled a {\r\n      cursor: default;\r\n      color: #999;\r\n    }\r\n\r\n    i {\r\n      font-size: 2rem;\r\n    }\r\n  }\r\n\r\n\r\n  li.pages ul li {\r\n    display: inline-block;\r\n    float: none;\r\n  }\r\n}\r\n@media #{$medium-and-down} {\r\n  .pagination {\r\n    width: 100%;\r\n\r\n    li.prev,\r\n    li.next {\r\n      width: 10%;\r\n    }\r\n\r\n    li.pages {\r\n      width: 80%;\r\n      overflow: hidden;\r\n      white-space: nowrap;\r\n    }\r\n  }\r\n}\r\n\r\n// Breadcrumbs\r\n.breadcrumb {\r\n  font-size: 18px;\r\n  color: rgba(255,255,255, .7);\r\n\r\n  i,\r\n  [class^=\"mdi-\"], [class*=\"mdi-\"],\r\n  i.material-icons {\r\n    display: inline-block;\r\n    float: left;\r\n    font-size: 24px;\r\n  }\r\n\r\n  &:before {\r\n    content: '\\E5CC';\r\n    color: rgba(255,255,255, .7);\r\n    vertical-align: top;\r\n    display: inline-block;\r\n    font-family: 'Material Icons';\r\n    font-weight: normal;\r\n    font-style: normal;\r\n    font-size: 25px;\r\n    margin: 0 10px 0 8px;\r\n    -webkit-font-smoothing: antialiased;\r\n  }\r\n\r\n  &:first-child:before {\r\n    display: none;\r\n  }\r\n\r\n  &:last-child {\r\n    color: #fff;\r\n  }\r\n}\r\n\r\n// Parallax\r\n.parallax-container {\r\n  position: relative;\r\n  overflow: hidden;\r\n  height: 500px;\r\n\r\n  .parallax {\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    z-index: -1;\r\n\r\n    img {\r\n      display: none;\r\n      position: absolute;\r\n      left: 50%;\r\n      bottom: 0;\r\n      min-width: 100%;\r\n      min-height: 100%;\r\n      transform: translate3d(0,0,0);\r\n      transform: translateX(-50%);\r\n    }\r\n  }\r\n}\r\n\r\n// Pushpin\r\n.pin-top, .pin-bottom {\r\n  position: relative;\r\n}\r\n.pinned {\r\n  position: fixed !important;\r\n}\r\n\r\n/*********************\r\n  Transition Classes\r\n**********************/\r\n\r\nul.staggered-list li {\r\n  opacity: 0;\r\n}\r\n\r\n.fade-in {\r\n  opacity: 0;\r\n  transform-origin: 0 50%;\r\n}\r\n\r\n\r\n/*********************\r\n  Media Query Classes\r\n**********************/\r\n.hide-on-small-only, .hide-on-small-and-down {\r\n  @media #{$small-and-down} {\r\n    display: none !important;\r\n  }\r\n}\r\n.hide-on-med-and-down {\r\n  @media #{$medium-and-down} {\r\n    display: none !important;\r\n  }\r\n}\r\n.hide-on-med-and-up {\r\n  @media #{$medium-and-up} {\r\n    display: none !important;\r\n  }\r\n}\r\n.hide-on-med-only {\r\n  @media only screen and (min-width: $small-screen) and (max-width: $medium-screen) {\r\n    display: none !important;\r\n  }\r\n}\r\n.hide-on-large-only {\r\n  @media #{$large-and-up} {\r\n    display: none !important;\r\n  }\r\n}\r\n.show-on-large {\r\n  @media #{$large-and-up} {\r\n    display: block !important;\r\n  }\r\n}\r\n.show-on-medium {\r\n  @media only screen and (min-width: $small-screen) and (max-width: $medium-screen) {\r\n    display: block !important;\r\n  }\r\n}\r\n.show-on-small {\r\n  @media #{$small-and-down} {\r\n    display: block !important;\r\n  }\r\n}\r\n.show-on-medium-and-up {\r\n  @media #{$medium-and-up} {\r\n    display: block !important;\r\n  }\r\n}\r\n.show-on-medium-and-down {\r\n  @media #{$medium-and-down} {\r\n    display: block !important;\r\n  }\r\n}\r\n\r\n\r\n// Center text on mobile\r\n.center-on-small-only {\r\n  @media #{$small-and-down} {\r\n    text-align: center;\r\n  }\r\n}\r\n\r\n// Footer\r\n.page-footer {\r\n  padding-top: 20px;\r\n  color: $footer-font-color;\r\n  background-color: $footer-bg-color;\r\n\r\n  .footer-copyright {\r\n    overflow: hidden;\r\n    min-height: 50px;\r\n    display: flex;\r\n    align-items: center;\r\n    padding: 10px 0px;\r\n    color: $footer-copyright-font-color;\r\n    background-color: $footer-copyright-bg-color;\r\n    @extend .light;\r\n  }\r\n}\r\n\r\n// Tables\r\ntable, th, td {\r\n   border: none;\r\n}\r\n\r\ntable {\r\n  width:100%;\r\n  display: table;\r\n\r\n  &.bordered > thead > tr,\r\n  &.bordered > tbody > tr {\r\n    border-bottom: 1px solid $table-border-color;\r\n  }\r\n\r\n  &.striped > tbody {\r\n    > tr:nth-child(odd) {\r\n      background-color: $table-striped-color;\r\n    }\r\n\r\n    > tr > td {\r\n      border-radius: 0;\r\n    }\r\n  }\r\n\r\n  &.highlight > tbody > tr {\r\n    transition: background-color .25s ease;\r\n    &:hover {\r\n      background-color: $table-striped-color;\r\n    }\r\n  }\r\n\r\n  &.centered {\r\n    thead tr th, tbody tr td {\r\n      text-align: center;\r\n    }\r\n  }\r\n\r\n}\r\n\r\nthead {\r\n  border-bottom: 1px solid $table-border-color;\r\n}\r\n\r\ntd, th{\r\n  padding: 15px 5px;\r\n  display: table-cell;\r\n  text-align: left;\r\n  vertical-align: middle;\r\n  border-radius: 2px;\r\n}\r\n\r\n// Responsive Table\r\n@media #{$medium-and-down} {\r\n\r\n  table.responsive-table {\r\n    width: 100%;\r\n    border-collapse: collapse;\r\n    border-spacing: 0;\r\n    display: block;\r\n    position: relative;\r\n\r\n    td:empty:before {\r\n      content: '\\00a0';\r\n    }\r\n\r\n    th,\r\n    td {\r\n      margin: 0;\r\n      vertical-align: top;\r\n    }\r\n\r\n    th { text-align: left; }\r\n    thead {\r\n      display: block;\r\n      float: left;\r\n\r\n      tr {\r\n        display: block;\r\n        padding: 0 10px 0 0;\r\n\r\n        th::before {\r\n          content: \"\\00a0\";\r\n        }\r\n      }\r\n    }\r\n    tbody {\r\n      display: block;\r\n      width: auto;\r\n      position: relative;\r\n      overflow-x: auto;\r\n      white-space: nowrap;\r\n\r\n      tr {\r\n        display: inline-block;\r\n        vertical-align: top;\r\n      }\r\n    }\r\n    th {\r\n      display: block;\r\n      text-align: right;\r\n    }\r\n    td {\r\n      display: block;\r\n      min-height: 1.25em;\r\n      text-align: left;\r\n    }\r\n    tr { padding: 0 10px; }\r\n\r\n    /* sort out borders */\r\n    thead {\r\n      border: 0;\r\n      border-right: 1px solid $table-border-color;\r\n    }\r\n\r\n    &.bordered {\r\n      th { border-bottom: 0; border-left: 0; }\r\n      td { border-left: 0; border-right: 0; border-bottom: 0; }\r\n      tr { border: 0; }\r\n      tbody tr { border-right: 1px solid $table-border-color; }\r\n    }\r\n\r\n  }\r\n\r\n}\r\n\r\n\r\n// Collections\r\n.collection {\r\n  margin: $element-top-margin 0 $element-bottom-margin 0;\r\n  border: 1px solid $collection-border-color;\r\n  border-radius: 2px;\r\n  overflow: hidden;\r\n  position: relative;\r\n\r\n  .collection-item {\r\n    background-color: $collection-bg-color;\r\n    line-height: $collection-line-height;\r\n    padding: 10px 20px;\r\n    margin: 0;\r\n    border-bottom: 1px solid $collection-border-color;\r\n\r\n    // Avatar Collection\r\n    &.avatar {\r\n      min-height: 84px;\r\n      padding-left: 72px;\r\n      position: relative;\r\n\r\n      // Don't style circles inside preloader classes.\r\n      &:not(.circle-clipper) > .circle,\r\n      :not(.circle-clipper) > .circle {\r\n        position: absolute;\r\n        width: 42px;\r\n        height: 42px;\r\n        overflow: hidden;\r\n        left: 15px;\r\n        display: inline-block;\r\n        vertical-align: middle;\r\n      }\r\n      i.circle {\r\n        font-size: 18px;\r\n        line-height: 42px;\r\n        color: #fff;\r\n        background-color: #999;\r\n        text-align: center;\r\n      }\r\n\r\n\r\n      .title {\r\n        font-size: 16px;\r\n      }\r\n\r\n      p {\r\n        margin: 0;\r\n      }\r\n\r\n      .secondary-content {\r\n        position: absolute;\r\n        top: 16px;\r\n        right: 16px;\r\n      }\r\n\r\n    }\r\n\r\n\r\n    &:last-child {\r\n      border-bottom: none;\r\n    }\r\n\r\n    &.active {\r\n      background-color: $collection-active-bg-color;\r\n      color: $collection-active-color;\r\n\r\n      .secondary-content {\r\n        color: #fff;\r\n      }\r\n    }\r\n  }\r\n  a.collection-item{\r\n    display: block;\r\n    transition: .25s;\r\n    color: $collection-link-color;\r\n    &:not(.active) {\r\n      &:hover {\r\n        background-color: $collection-hover-bg-color;\r\n      }\r\n    }\r\n  }\r\n\r\n  &.with-header {\r\n    .collection-header {\r\n      background-color: $collection-bg-color;\r\n      border-bottom: 1px solid $collection-border-color;\r\n      padding: 10px 20px;\r\n    }\r\n    .collection-item {\r\n      padding-left: 30px;\r\n    }\r\n    .collection-item.avatar {\r\n      padding-left: 72px;\r\n    }\r\n  }\r\n\r\n}\r\n// Made less specific to allow easier overriding\r\n.secondary-content {\r\n  float: right;\r\n  color: $secondary-color;\r\n}\r\n.collapsible .collection {\r\n  margin: 0;\r\n  border: none;\r\n}\r\n\r\n\r\n\r\n// Responsive Videos\r\n.video-container {\r\n    position: relative;\r\n    padding-bottom: 56.25%;\r\n    height: 0;\r\n    overflow: hidden;\r\n\r\n    iframe, object, embed {\r\n      position: absolute;\r\n      top: 0;\r\n      left: 0;\r\n      width: 100%;\r\n      height: 100%;\r\n    }\r\n}\r\n\r\n// Progress Bar\r\n.progress {\r\n    position: relative;\r\n    height: 4px;\r\n    display: block;\r\n    width: 100%;\r\n    background-color: lighten($progress-bar-color, 40%);\r\n    border-radius: 2px;\r\n    margin: $element-top-margin 0 $element-bottom-margin 0;\r\n    overflow: hidden;\r\n  .determinate {\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    bottom: 0;\r\n    background-color: $progress-bar-color;\r\n    transition: width .3s linear;\r\n  }\r\n  .indeterminate {\r\n    background-color: $progress-bar-color;\r\n    &:before {\r\n      content: '';\r\n      position: absolute;\r\n      background-color: inherit;\r\n      top: 0;\r\n      left:0;\r\n      bottom: 0;\r\n      will-change: left, right;\r\n      // Custom bezier\r\n      animation: indeterminate 2.1s cubic-bezier(0.650, 0.815, 0.735, 0.395) infinite;\r\n\r\n    }\r\n    &:after {\r\n      content: '';\r\n      position: absolute;\r\n      background-color: inherit;\r\n      top: 0;\r\n      left:0;\r\n      bottom: 0;\r\n      will-change: left, right;\r\n      // Custom bezier\r\n      animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.840, 0.440, 1.000) infinite;\r\n      animation-delay: 1.15s;\r\n    }\r\n  }\r\n}\r\n@keyframes indeterminate {\r\n    0% {\r\n      left: -35%;\r\n      right:100%;\r\n    }\r\n    60% {\r\n      left: 100%;\r\n      right: -90%;\r\n    }\r\n    100% {\r\n      left: 100%;\r\n      right: -90%;\r\n    }\r\n}\r\n\r\n@keyframes indeterminate-short {\r\n    0% {\r\n      left: -200%;\r\n      right: 100%;\r\n    }\r\n    60% {\r\n      left: 107%;\r\n      right: -8%;\r\n    }\r\n    100% {\r\n      left: 107%;\r\n      right: -8%;\r\n    }\r\n}\r\n\r\n\r\n/*******************\r\n  Utility Classes\r\n*******************/\r\n\r\n.hide {\r\n  display: none !important;\r\n}\r\n\r\n// Text Align\r\n.left-align {\r\n  text-align: left;\r\n}\r\n.right-align {\r\n  text-align: right\r\n}\r\n.center, .center-align {\r\n  text-align: center;\r\n}\r\n\r\n.left {\r\n  float: left !important;\r\n}\r\n.right {\r\n  float: right !important;\r\n}\r\n\r\n// No Text Select\r\n.no-select {\r\n  user-select: none;\r\n}\r\n\r\n.circle {\r\n  border-radius: 50%;\r\n}\r\n\r\n.center-block {\r\n  display: block;\r\n  margin-left: auto;\r\n  margin-right: auto;\r\n}\r\n\r\n.truncate {\r\n  display: block;\r\n  white-space: nowrap;\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n}\r\n\r\n.no-padding {\r\n  padding: 0 !important;\r\n}\r\n",".container {\r\n  margin: 0 auto;\r\n  max-width: 1280px;\r\n  width: 90%;\r\n}\r\n@media #{$medium-and-up} {\r\n  .container {\r\n    width: 85%;\r\n  }\r\n}\r\n@media #{$large-and-up} {\r\n  .container {\r\n    width: 70%;\r\n  }\r\n}\r\n.container .row {\r\n  margin-left: (-1 * $gutter-width / 2);\r\n  margin-right: (-1 * $gutter-width / 2);\r\n}\r\n\r\n.section {\r\n  padding-top: 1rem;\r\n  padding-bottom: 1rem;\r\n\r\n  &.no-pad {\r\n    padding: 0;\r\n  }\r\n  &.no-pad-bot {\r\n    padding-bottom: 0;\r\n  }\r\n  &.no-pad-top {\r\n    padding-top: 0;\r\n  }\r\n}\r\n\r\n\r\n// Mixins to eliminate code repitition\r\n@mixin reset-offset {\r\n  margin-left: auto;\r\n  left: auto;\r\n  right: auto;\r\n}\r\n@mixin grid-classes($size, $i, $perc) {\r\n  &.offset-#{$size}#{$i} {\r\n    margin-left: $perc;\r\n  }\r\n  &.pull-#{$size}#{$i} {\r\n    right: $perc;\r\n  }\r\n  &.push-#{$size}#{$i} {\r\n    left: $perc;\r\n  }\r\n}\r\n\r\n\r\n.row {\r\n  margin-left: auto;\r\n  margin-right: auto;\r\n  margin-bottom: 20px;\r\n\r\n  // Clear floating children\r\n  &:after {\r\n    content: \"\";\r\n    display: table;\r\n    clear: both;\r\n  }\r\n\r\n  .col {\r\n    float: left;\r\n    box-sizing: border-box;\r\n    padding: 0 $gutter-width / 2;\r\n    min-height: 1px;\r\n\r\n    &[class*=\"push-\"],\r\n    &[class*=\"pull-\"] {\r\n      position: relative;\r\n    }\r\n\r\n    $i: 1;\r\n    @while $i <= $num-cols {\r\n      $perc: unquote((100 / ($num-cols / $i)) + \"%\");\r\n      &.s#{$i} {\r\n        width: $perc;\r\n        @include reset-offset;\r\n      }\r\n      $i: $i + 1;\r\n    }\r\n\r\n    $i: 1;\r\n    @while $i <= $num-cols {\r\n      $perc: unquote((100 / ($num-cols / $i)) + \"%\");\r\n      @include grid-classes(\"s\", $i, $perc);\r\n      $i: $i + 1;\r\n    }\r\n\r\n    @media #{$medium-and-up} {\r\n\r\n      $i: 1;\r\n      @while $i <= $num-cols {\r\n        $perc: unquote((100 / ($num-cols / $i)) + \"%\");\r\n        &.m#{$i} {\r\n          width: $perc;\r\n          @include reset-offset;\r\n        }\r\n        $i: $i + 1\r\n      }\r\n\r\n      $i: 1;\r\n      @while $i <= $num-cols {\r\n        $perc: unquote((100 / ($num-cols / $i)) + \"%\");\r\n        @include grid-classes(\"m\", $i, $perc);\r\n        $i: $i + 1;\r\n      }\r\n    }\r\n\r\n    @media #{$large-and-up} {\r\n\r\n      $i: 1;\r\n      @while $i <= $num-cols {\r\n        $perc: unquote((100 / ($num-cols / $i)) + \"%\");\r\n        &.l#{$i} {\r\n          width: $perc;\r\n          @include reset-offset;\r\n        }\r\n        $i: $i + 1;\r\n      }\r\n\r\n      $i: 1;\r\n      @while $i <= $num-cols {\r\n        $perc: unquote((100 / ($num-cols / $i)) + \"%\");\r\n        @include grid-classes(\"l\", $i, $perc);\r\n        $i: $i + 1;\r\n      }\r\n    }\r\n\r\n    @media #{$extra-large-and-up} {\r\n\r\n      $i: 1;\r\n      @while $i <= $num-cols {\r\n        $perc: unquote((100 / ($num-cols / $i)) + \"%\");\r\n        &.xl#{$i} {\r\n          width: $perc;\r\n          @include reset-offset;\r\n        }\r\n        $i: $i + 1;\r\n      }\r\n\r\n      $i: 1;\r\n      @while $i <= $num-cols {\r\n        $perc: unquote((100 / ($num-cols / $i)) + \"%\");\r\n        @include grid-classes(\"xl\", $i, $perc);\r\n        $i: $i + 1;\r\n      }\r\n    }\r\n  }\r\n}\r\n","nav {\r\n  &.nav-extended {\r\n    height: auto;\r\n\r\n    .nav-wrapper {\r\n      min-height: $navbar-height-mobile;\r\n      height: auto;\r\n    }\r\n\r\n    .nav-content {\r\n      position: relative;\r\n      line-height: normal;\r\n    }\r\n  }\r\n\r\n  color: $navbar-font-color;\r\n  @extend .z-depth-1;\r\n  background-color: $primary-color;\r\n  width: 100%;\r\n  height: $navbar-height-mobile;\r\n  line-height: $navbar-line-height-mobile;\r\n\r\n  a { color: $navbar-font-color; }\r\n\r\n  i,\r\n  [class^=\"mdi-\"], [class*=\"mdi-\"],\r\n  i.material-icons {\r\n    display: block;\r\n    font-size: 24px;\r\n    height: $navbar-height-mobile;\r\n    line-height: $navbar-line-height-mobile;\r\n  }\r\n\r\n  .nav-wrapper {\r\n    position: relative;\r\n    height: 100%;\r\n  }\r\n\r\n  @media #{$large-and-up} {\r\n    a.button-collapse { display: none; }\r\n  }\r\n\r\n\r\n  // Collapse button\r\n  .button-collapse {\r\n    float: left;\r\n    position: relative;\r\n    z-index: 1;\r\n    height: $navbar-height-mobile;\r\n    margin: 0 18px;\r\n\r\n    i {\r\n      height: $navbar-height-mobile;\r\n      line-height: $navbar-line-height-mobile;\r\n    }\r\n  }\r\n\r\n\r\n  // Logo\r\n  .brand-logo {\r\n    position: absolute;\r\n    color: $navbar-font-color;\r\n    display: inline-block;\r\n    font-size: $navbar-brand-font-size;\r\n    padding: 0;\r\n\r\n    &.center {\r\n      left: 50%;\r\n      transform: translateX(-50%);\r\n    }\r\n\r\n    @media #{$medium-and-down} {\r\n      left: 50%;\r\n      transform: translateX(-50%);\r\n\r\n      &.left, &.right {\r\n        padding: 0;\r\n        transform: none;\r\n      }\r\n\r\n      &.left { left: 0.5rem; }\r\n      &.right {\r\n        right: 0.5rem;\r\n        left: auto;\r\n      }\r\n    }\r\n\r\n    &.right {\r\n      right: 0.5rem;\r\n      padding: 0;\r\n    }\r\n\r\n    i,\r\n    [class^=\"mdi-\"], [class*=\"mdi-\"],\r\n    i.material-icons {\r\n      float: left;\r\n      margin-right: 15px;\r\n    }\r\n  }\r\n\r\n\r\n  // Title\r\n  .nav-title {\r\n    display: inline-block;\r\n    font-size: 32px;\r\n    padding: 28px 0;\r\n  }\r\n\r\n\r\n  // Navbar Links\r\n  ul {\r\n    margin: 0;\r\n\r\n    li {\r\n      transition: background-color .3s;\r\n      float: left;\r\n      padding: 0;\r\n\r\n      &.active {\r\n        background-color: rgba(0,0,0,.1);\r\n      }\r\n    }\r\n    a {\r\n      transition: background-color .3s;\r\n      font-size: $navbar-font-size;\r\n      color: $navbar-font-color;\r\n      display: block;\r\n      padding: 0 15px;\r\n      cursor: pointer;\r\n\r\n      &.btn, &.btn-large, &.btn-flat, &.btn-floating {\r\n        margin-top: -2px;\r\n        margin-left: 15px;\r\n        margin-right: 15px;\r\n\r\n        & > .material-icons {\r\n          height: inherit;\r\n          line-height: inherit;\r\n        }\r\n      }\r\n\r\n      &:hover {\r\n        background-color: rgba(0,0,0,.1);\r\n      }\r\n    }\r\n\r\n    &.left {\r\n      float: left;\r\n    }\r\n  }\r\n\r\n  // Navbar Search Form\r\n  form {\r\n    height: 100%;\r\n  }\r\n\r\n  .input-field {\r\n    margin: 0;\r\n    height: 100%;\r\n\r\n    input {\r\n      height: 100%;\r\n      font-size: 1.2rem;\r\n      border: none;\r\n      padding-left: 2rem;\r\n\r\n      &:focus, &[type=text]:valid, &[type=password]:valid,\r\n      &[type=email]:valid, &[type=url]:valid, &[type=date]:valid {\r\n        border: none;\r\n        box-shadow: none;\r\n      }\r\n    }\r\n\r\n    label {\r\n      top: 0;\r\n      left: 0;\r\n\r\n      i {\r\n        color: rgba(255,255,255,.7);\r\n        transition: color .3s;\r\n      }\r\n      &.active i { color: $navbar-font-color; }\r\n    }\r\n  }\r\n}\r\n\r\n// Fixed Navbar\r\n.navbar-fixed {\r\n  position: relative;\r\n  height: $navbar-height-mobile;\r\n  z-index: 997;\r\n\r\n  nav {\r\n    position: fixed;\r\n  }\r\n}\r\n@media #{$medium-and-up} {\r\n  nav.nav-extended .nav-wrapper {\r\n    min-height: $navbar-height;\r\n  }\r\n  nav, nav .nav-wrapper i, nav a.button-collapse, nav a.button-collapse i {\r\n    height: $navbar-height;\r\n    line-height: $navbar-line-height;\r\n  }\r\n  .navbar-fixed {\r\n    height: $navbar-height;\r\n  }\r\n}\r\n","\r\na {\r\n  text-decoration: none;\r\n}\r\n\r\nhtml{\r\n  line-height: 1.5;\r\n\r\n  @media only screen and (min-width: 0) {\r\n    font-size: 14px;\r\n  }\r\n\r\n  @media only screen and (min-width: $medium-screen) {\r\n    font-size: 14.5px;\r\n  }\r\n\r\n  @media only screen and (min-width: $large-screen) {\r\n    font-size: 15px;\r\n  }\r\n\r\n  font-family: \"Roboto\", sans-serif;\r\n  font-weight: normal;\r\n  color: $off-black;\r\n}\r\nh1, h2, h3, h4, h5, h6 {\r\n\tfont-weight: 400;\r\n\tline-height: 1.1;\r\n}\r\n\r\n// Header Styles\r\nh1 a, h2 a, h3 a, h4 a, h5 a, h6 a { font-weight: inherit; }\r\nh1 { font-size: $h1-fontsize; line-height: 110%; margin: ($h1-fontsize / 2) 0 ($h1-fontsize / 2.5) 0;}\r\nh2 { font-size: $h2-fontsize; line-height: 110%; margin: ($h2-fontsize / 2) 0 ($h2-fontsize / 2.5) 0;}\r\nh3 { font-size: $h3-fontsize; line-height: 110%; margin: ($h3-fontsize / 2) 0 ($h3-fontsize / 2.5) 0;}\r\nh4 { font-size: $h4-fontsize; line-height: 110%; margin: ($h4-fontsize / 2) 0 ($h4-fontsize / 2.5) 0;}\r\nh5 { font-size: $h5-fontsize; line-height: 110%; margin: ($h5-fontsize / 2) 0 ($h5-fontsize / 2.5) 0;}\r\nh6 { font-size: $h6-fontsize; line-height: 110%; margin: ($h6-fontsize / 2) 0 ($h6-fontsize / 2.5) 0;}\r\n\r\n// Text Styles\r\nem { font-style: italic; }\r\nstrong { font-weight: 500; }\r\nsmall { font-size: 75%; }\r\n.light { font-weight: 300; }\r\n.thin { font-weight: 200; }\r\n\r\n\r\n.flow-text{\r\n  font-weight: 300;\r\n  $i: 0;\r\n  @while $i <= $intervals {\r\n    @media only screen and (min-width : 360 + ($i * $interval-size)) {\r\n      font-size: 1.2rem * (1 + (.02 * $i));\r\n    }\r\n    $i: $i + 1;\r\n  }\r\n\r\n  // Handle below 360px screen\r\n  @media only screen and (max-width: 360px) {\r\n    font-size: 1.2rem;\r\n  }\r\n}","// shared styles\r\n.btn,\r\n.btn-flat {\r\n  border: $button-border;\r\n  border-radius: $button-radius;\r\n  display: inline-block;\r\n  height: $button-height;\r\n  line-height: $button-height;\r\n  padding: $button-padding;\r\n  text-transform: uppercase;\r\n  vertical-align: middle;\r\n  // Gets rid of tap active state\r\n  -webkit-tap-highlight-color: transparent;\r\n}\r\n\r\n// Disabled shared style\r\n.btn.disabled,\r\n.btn-floating.disabled,\r\n.btn-large.disabled,\r\n.btn-flat.disabled,\r\n.btn:disabled,\r\n.btn-floating:disabled,\r\n.btn-large:disabled,\r\n.btn-flat:disabled,\r\n.btn[disabled],\r\n.btn-floating[disabled],\r\n.btn-large[disabled],\r\n.btn-flat[disabled] {\r\n  pointer-events: none;\r\n  background-color: $button-disabled-background !important;\r\n  box-shadow: none;\r\n  color: $button-disabled-color !important;\r\n  cursor: default;\r\n\r\n  &:hover {\r\n    background-color: $button-disabled-background !important;\r\n    color: $button-disabled-color !important;\r\n  }\r\n}\r\n\r\n// Shared icon styles\r\n.btn,\r\n.btn-floating,\r\n.btn-large,\r\n.btn-flat {\r\n  font-size: $button-font-size;\r\n  outline: 0;\r\n\r\n  i {\r\n    font-size: $button-icon-font-size;\r\n    line-height: inherit;\r\n  }\r\n}\r\n\r\n// Shared focus button style\r\n.btn,\r\n.btn-floating {\r\n  &:focus {\r\n    background-color: darken($button-raised-background, 10%);\r\n  }\r\n}\r\n\r\n// Raised Button\r\n.btn {\r\n  text-decoration: none;\r\n  color: $button-raised-color;\r\n  background-color: $button-raised-background;\r\n  text-align: center;\r\n  letter-spacing: .5px;\r\n  @extend .z-depth-1;\r\n  transition: .2s ease-out;\r\n  cursor: pointer;\r\n\r\n  &:hover {\r\n    background-color: $button-raised-background-hover;\r\n    @extend .z-depth-1-half;\r\n  }\r\n}\r\n\r\n// Floating button\r\n.btn-floating {\r\n  &:hover {\r\n    background-color: $button-floating-background-hover;\r\n    @extend .z-depth-1-half;\r\n  }\r\n\r\n  &:before {\r\n    border-radius: 0;\r\n  }\r\n\r\n  &.btn-large {\r\n    &.halfway-fab {\r\n      bottom: -$button-floating-large-size / 2;\r\n    }\r\n\r\n    width: $button-floating-large-size;\r\n    height: $button-floating-large-size;\r\n    i {\r\n      line-height: $button-floating-large-size;\r\n    }\r\n  }\r\n\r\n  &.halfway-fab {\r\n    &.left {\r\n      right: auto;\r\n      left: 24px;\r\n    }\r\n\r\n    position: absolute;\r\n    right: 24px;\r\n    bottom: -$button-floating-size / 2;\r\n  }\r\n\r\n  display: inline-block;\r\n  color: $button-floating-color;\r\n  position: relative;\r\n  overflow: hidden;\r\n  z-index: 1;\r\n  width: $button-floating-size;\r\n  height: $button-floating-size;\r\n  line-height: $button-floating-size;\r\n  padding: 0;\r\n  background-color: $button-floating-background;\r\n  border-radius: $button-floating-radius;\r\n  @extend .z-depth-1;\r\n  transition: .3s;\r\n  cursor: pointer;\r\n  vertical-align: middle;\r\n\r\n  i {\r\n    width: inherit;\r\n    display: inline-block;\r\n    text-align: center;\r\n    color: $button-floating-color;\r\n    font-size: $button-large-icon-font-size;\r\n    line-height: $button-floating-size;\r\n  }\r\n}\r\n\r\n// button fix\r\nbutton.btn-floating {\r\n  border: $button-border;\r\n}\r\n\r\n// Fixed Action Button\r\n.fixed-action-btn {\r\n  &.active {\r\n    ul {\r\n     visibility: visible;\r\n    }\r\n  }\r\n\r\n  &.horizontal {\r\n    padding: 0 0 0 15px;\r\n\r\n    ul {\r\n      text-align: right;\r\n      right: 64px;\r\n      top: 50%;\r\n      transform: translateY(-50%);\r\n      height: 100%;\r\n      left: auto;\r\n      width: 500px; /*width 100% only goes to width of button container */\r\n\r\n      li {\r\n        display: inline-block;\r\n        margin: 15px 15px 0 0;\r\n      }\r\n    }\r\n  }\r\n\r\n  &.toolbar {\r\n    &.active {\r\n      & > a i {\r\n        opacity: 0;\r\n      }\r\n    }\r\n\r\n    padding: 0;\r\n    height: $button-floating-large-size;\r\n\r\n    ul {\r\n      display: flex;\r\n      top: 0;\r\n      bottom: 0;\r\n      z-index: 1;\r\n\r\n      li {\r\n        flex: 1;\r\n        display: inline-block;\r\n        margin: 0;\r\n        height: 100%;\r\n        transition: none;\r\n\r\n        a {\r\n          display: block;\r\n          overflow: hidden;\r\n          position: relative;\r\n          width: 100%;\r\n          height: 100%;\r\n          background-color: transparent;\r\n          box-shadow: none;\r\n          color: #fff;\r\n          line-height: $button-floating-large-size;\r\n          z-index: 1;\r\n\r\n          i {\r\n            line-height: inherit;\r\n          }\r\n        }\r\n      }\r\n    }\r\n  }\r\n\r\n  position: fixed;\r\n  right: 23px;\r\n  bottom: 23px;\r\n  padding-top: 15px;\r\n  margin-bottom: 0;\r\n  z-index: 997;\r\n\r\n  ul {\r\n    left: 0;\r\n    right: 0;\r\n    text-align: center;\r\n    position: absolute;\r\n    bottom: 64px;\r\n    margin: 0;\r\n    visibility: hidden;\r\n\r\n    li {\r\n      margin-bottom: 15px;\r\n    }\r\n\r\n    a.btn-floating {\r\n      opacity: 0;\r\n    }\r\n  }\r\n\r\n  .fab-backdrop {\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    z-index: -1;\r\n    width: $button-floating-size;\r\n    height: $button-floating-size;\r\n    background-color: $button-floating-background;\r\n    border-radius: $button-floating-radius;\r\n    transform: scale(0);\r\n  }\r\n}\r\n\r\n// Flat button\r\n.btn-flat {\r\n  box-shadow: none;\r\n  background-color: transparent;\r\n  color: $button-flat-color;\r\n  cursor: pointer;\r\n  transition: background-color .2s;\r\n\r\n  &:focus,\r\n  &:hover {\r\n    box-shadow: none;\r\n  }\r\n\r\n  &:focus {\r\n    background-color: rgba(0,0,0,.1);\r\n  }\r\n\r\n  &.disabled {\r\n    background-color: transparent !important;\r\n    color: $button-flat-disabled-color !important;\r\n    cursor: default;\r\n  }\r\n}\r\n\r\n// Large button\r\n.btn-large {\r\n  @extend .btn;\r\n  height: $button-large-height;\r\n  line-height: $button-large-height;\r\n\r\n  i {\r\n    font-size: $button-large-icon-font-size;\r\n  }\r\n}\r\n\r\n// Block button\r\n.btn-block {\r\n  display: block;\r\n}\r\n",".dropdown-content {\r\n  @extend .z-depth-1;\r\n  background-color: $dropdown-bg-color;\r\n  margin: 0;\r\n  display: none;\r\n  min-width: 100px;\r\n  max-height: 650px;\r\n  overflow-y: auto;\r\n  opacity: 0;\r\n  position: absolute;\r\n  z-index: 999;\r\n  will-change: width, height;\r\n\r\n  li {\r\n    clear: both;\r\n    color: $off-black;\r\n    cursor: pointer;\r\n    min-height: $dropdown-item-height;\r\n    line-height: 1.5rem;\r\n    width: 100%;\r\n    text-align: left;\r\n    text-transform: none;\r\n\r\n    &:hover, &.active, &.selected {\r\n      background-color: $dropdown-hover-bg-color;\r\n    }\r\n\r\n    &.active.selected {\r\n      background-color: darken($dropdown-hover-bg-color, 5%);\r\n    }\r\n\r\n    &.divider {\r\n      min-height: 0;\r\n      height: 1px;\r\n    }\r\n\r\n    & > a, & > span {\r\n      font-size: 16px;\r\n      color: $dropdown-color;\r\n      display: block;\r\n      line-height: 22px;\r\n      padding: (($dropdown-item-height - 22) / 2) 16px;\r\n    }\r\n\r\n    & > span > label {\r\n      top: 1px;\r\n      left: 0;\r\n      height: 18px;\r\n    }\r\n\r\n    // Icon alignment override\r\n    & > a > i {\r\n      height: inherit;\r\n      line-height: inherit;\r\n      float: left;\r\n      margin: 0 24px 0 0;\r\n      width: 24px;\r\n    }\r\n  }\r\n}\r\n\r\n// Input field specificity bugfix\r\n.input-field.col .dropdown-content [type=\"checkbox\"] + label {\r\n  top: 1px;\r\n  left: 0;\r\n  height: 18px;\r\n}\r\n\r\n",".collapsible {\r\n  border-top: 1px solid $collapsible-border-color;\r\n  border-right: 1px solid $collapsible-border-color;\r\n  border-left: 1px solid $collapsible-border-color;\r\n  margin: $element-top-margin 0 $element-bottom-margin 0;\r\n  @extend .z-depth-1;\r\n}\r\n\r\n.collapsible-header {\r\n  display: flex;\r\n  cursor: pointer;\r\n  -webkit-tap-highlight-color: transparent;\r\n  line-height: 1.5;\r\n  padding: 1rem;\r\n  background-color: $collapsible-header-color;\r\n  border-bottom: 1px solid $collapsible-border-color;\r\n\r\n  i {\r\n    width: 2rem;\r\n    font-size: 1.6rem;\r\n    display: inline-block;\r\n    text-align: center;\r\n    margin-right: 1rem;\r\n  }\r\n}\r\n\r\n.collapsible-body {\r\n  display: none;\r\n  border-bottom: 1px solid $collapsible-border-color;\r\n  box-sizing: border-box;\r\n  padding: 2rem;\r\n}\r\n\r\n// sideNav collapsible styling\r\n.side-nav,\r\n.side-nav.fixed {\r\n\r\n  .collapsible {\r\n    border: none;\r\n    box-shadow: none;\r\n\r\n    li { padding: 0; }\r\n  }\r\n\r\n  .collapsible-header {\r\n    background-color: transparent;\r\n    border: none;\r\n    line-height: inherit;\r\n    height: inherit;\r\n    padding: 0 $sidenav-padding;\r\n\r\n    &:hover { background-color: rgba(0,0,0,.05); }\r\n    i { line-height: inherit; }\r\n  }\r\n\r\n  .collapsible-body {\r\n    border: 0;\r\n    background-color: $collapsible-header-color;\r\n\r\n    li a {\r\n      padding: 0 (7.5px + $sidenav-padding)\r\n               0 (15px + $sidenav-padding);\r\n    }\r\n  }\r\n\r\n}\r\n\r\n// Popout Collapsible\r\n\r\n.collapsible.popout {\r\n  border: none;\r\n  box-shadow: none;\r\n  > li {\r\n    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\r\n    // transform: scaleX(.92);\r\n    margin: 0 24px;\r\n    transition: margin .35s cubic-bezier(0.250, 0.460, 0.450, 0.940);\r\n  }\r\n  > li.active {\r\n    box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15);\r\n    margin: 16px 0;\r\n    // transform: scaleX(1);\r\n  }\r\n}\r\n","// Remove Focus Boxes\r\nselect:focus {\r\n  outline: $select-focus;\r\n}\r\n\r\nbutton:focus {\r\n  outline: none;\r\n  background-color: $button-background-focus;\r\n}\r\n\r\nlabel {\r\n  font-size: $label-font-size;\r\n  color: $input-border-color;\r\n}\r\n\r\n@import 'input-fields';\r\n@import 'radio-buttons';\r\n@import 'checkboxes';\r\n@import 'switches';\r\n@import 'select';\r\n@import 'file-input';\r\n@import 'range';\r\n","/* Text Inputs + Textarea\r\n   ========================================================================== */\r\n\r\n/* Style Placeholders */\r\n\r\n::placeholder {\r\n  color: $placeholder-text-color;\r\n}\r\n\r\n/* Text inputs */\r\n\r\ninput:not([type]),\r\ninput[type=text]:not(.browser-default),\r\ninput[type=password]:not(.browser-default),\r\ninput[type=email]:not(.browser-default),\r\ninput[type=url]:not(.browser-default),\r\ninput[type=time]:not(.browser-default),\r\ninput[type=date]:not(.browser-default),\r\ninput[type=datetime]:not(.browser-default),\r\ninput[type=datetime-local]:not(.browser-default),\r\ninput[type=tel]:not(.browser-default),\r\ninput[type=number]:not(.browser-default),\r\ninput[type=search]:not(.browser-default),\r\ntextarea.materialize-textarea {\r\n\r\n  // General Styles\r\n  background-color: transparent;\r\n  border: none;\r\n  border-bottom: $input-border;\r\n  border-radius: 0;\r\n  outline: none;\r\n  height: $input-height;\r\n  width: 100%;\r\n  font-size: $input-font-size;\r\n  margin: $input-margin;\r\n  padding: $input-padding;\r\n  box-shadow: none;\r\n  box-sizing: content-box;\r\n  transition: $input-transition;\r\n\r\n  // Disabled input style\r\n  &:disabled,\r\n  &[readonly=\"readonly\"] {\r\n    color: $input-disabled-color;\r\n    border-bottom: $input-disabled-border;\r\n  }\r\n\r\n  // Disabled label style\r\n  &:disabled+label,\r\n  &[readonly=\"readonly\"]+label {\r\n    color: $input-disabled-color;\r\n  }\r\n\r\n  // Focused input style\r\n  &:focus:not([readonly]) {\r\n    border-bottom: 1px solid $input-focus-color;\r\n    box-shadow: 0 1px 0 0 $input-focus-color;\r\n  }\r\n\r\n  // Focused label style\r\n  &:focus:not([readonly])+label {\r\n    color: $input-focus-color;\r\n  }\r\n\r\n  // Valid Input Style\r\n  &.valid,\r\n  &:focus.valid {\r\n    @extend %valid-input-style;\r\n  }\r\n\r\n  // Custom Success Message\r\n  &.valid + label:after,\r\n  &:focus.valid + label:after {\r\n    @extend %custom-success-message;\r\n  }\r\n\r\n  // Invalid Input Style\r\n  &.invalid,\r\n  &:focus.invalid {\r\n    @extend %invalid-input-style;\r\n  }\r\n\r\n  // Custom Error message\r\n  &.invalid + label:after,\r\n  &:focus.invalid + label:after {\r\n    @extend %custom-error-message;\r\n  }\r\n\r\n  // Full width label when using validate for error messages\r\n  &.validate + label {\r\n    width: 100%;\r\n  }\r\n\r\n  // Form Message Shared Styles\r\n  & + label:after {\r\n    @extend %input-after-style;\r\n  }\r\n\r\n  // TODO: Remove once input fields are reworked to support validation messages better\r\n  &.invalid + label:after,\r\n  &.valid + label:after{\r\n    display: none;\r\n  }\r\n\r\n  &.invalid + label.active:after,\r\n  &.valid + label.active:after{\r\n    display: block;\r\n  }\r\n}\r\n\r\n\r\n/* Validation Sass Placeholders */\r\n%valid-input-style {\r\n  border-bottom: 1px solid $input-success-color;\r\n  box-shadow: 0 1px 0 0 $input-success-color;\r\n}\r\n%invalid-input-style {\r\n  border-bottom: $input-invalid-border;\r\n  box-shadow: 0 1px 0 0 $input-error-color;\r\n}\r\n%custom-success-message {\r\n  content: attr(data-success);\r\n  color: $input-success-color;\r\n  opacity: 1;\r\n  transform: translateY(9px);\r\n}\r\n%custom-error-message {\r\n  content: attr(data-error);\r\n  color: $input-error-color;\r\n  opacity: 1;\r\n  transform: translateY(9px);\r\n}\r\n%input-after-style {\r\n  display: block;\r\n  content: \"\";\r\n  position: absolute;\r\n  top: 100%;\r\n  left: 0;\r\n  opacity: 0;\r\n  transition: .2s opacity ease-out, .2s color ease-out;\r\n}\r\n\r\n\r\n// Styling for input field wrapper\r\n.input-field {\r\n  // Inline styles\r\n  &.inline {\r\n    display: inline-block;\r\n    vertical-align: middle;\r\n    margin-left: 5px;\r\n\r\n    input,\r\n    .select-dropdown {\r\n      margin-bottom: 1rem;\r\n    }\r\n  }\r\n\r\n  // Gutter spacing\r\n  &.col {\r\n    label {\r\n      left: $gutter-width / 2;\r\n    }\r\n\r\n    .prefix ~ label,\r\n    .prefix ~ .validate ~ label {\r\n      width: calc(100% - 3rem - #{$gutter-width});\r\n    }\r\n  }\r\n\r\n  position: relative;\r\n  margin-top: 1rem;\r\n\r\n  label {\r\n    color: $input-border-color;\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    height: 100%;\r\n    font-size: 1rem;\r\n    cursor: text;\r\n    transition: transform .2s ease-out;\r\n    transform-origin: 0% 100%;\r\n    text-align: initial;\r\n    transform: translateY(12px);\r\n    pointer-events: none;\r\n\r\n    &:not(.label-icon).active {\r\n      transform: translateY(-14px) scale(.8);\r\n      transform-origin: 0 0;\r\n    }\r\n  }\r\n\r\n  // Prefix Icons\r\n  .prefix {\r\n    position: absolute;\r\n    width: $input-height;\r\n    font-size: 2rem;\r\n    transition: color .2s;\r\n\r\n    &.active { color: $input-focus-color; }\r\n  }\r\n\r\n  .prefix ~ input,\r\n  .prefix ~ textarea,\r\n  .prefix ~ label,\r\n  .prefix ~ .validate ~ label,\r\n  .prefix ~ .autocomplete-content {\r\n    margin-left: 3rem;\r\n    width: 92%;\r\n    width: calc(100% - 3rem);\r\n  }\r\n\r\n  .prefix ~ label { margin-left: 3rem; }\r\n\r\n  @media #{$medium-and-down} {\r\n    .prefix ~ input {\r\n      width: 86%;\r\n      width: calc(100% - 3rem);\r\n    }\r\n  }\r\n\r\n  @media #{$small-and-down} {\r\n    .prefix ~ input {\r\n      width: 80%;\r\n      width: calc(100% - 3rem);\r\n    }\r\n  }\r\n}\r\n\r\n\r\n/* Search Field */\r\n\r\n.input-field input[type=search] {\r\n  display: block;\r\n  line-height: inherit;\r\n\r\n  .nav-wrapper & {\r\n    height: inherit;\r\n    padding-left: 4rem;\r\n    width: calc(100% - 4rem);\r\n    border: 0;\r\n    box-shadow: none;\r\n  }\r\n\r\n  &:focus {\r\n    background-color: $input-background;\r\n    border: 0;\r\n    box-shadow: none;\r\n    color: #444;\r\n\r\n    & + label i,\r\n    & ~ .mdi-navigation-close,\r\n    & ~ .material-icons {\r\n      color: #444;\r\n    }\r\n  }\r\n\r\n  & + label {\r\n    left: 1rem;\r\n  }\r\n\r\n  & ~ .mdi-navigation-close,\r\n  & ~ .material-icons {\r\n    position: absolute;\r\n    top: 0;\r\n    right: 1rem;\r\n    color: transparent;\r\n    cursor: pointer;\r\n    font-size: 2rem;\r\n    transition: .3s color;\r\n  }\r\n}\r\n\r\n\r\n/* Textarea */\r\n\r\n// Default textarea\r\ntextarea {\r\n  width: 100%;\r\n  height: $input-height;\r\n  background-color: transparent;\r\n\r\n  &.materialize-textarea {\r\n    // Fixes validation messages for dynamic textareas\r\n    &.validate + label {\r\n      &::after {\r\n        top: calc(100% - 12px);\r\n      }\r\n      &:not(.label-icon).active {\r\n        transform: translateY(-25px);\r\n      }\r\n      height: 100%;\r\n    }\r\n\r\n    overflow-y: hidden; /* prevents scroll bar flash */\r\n    padding: .8rem 0 1.6rem 0; /* prevents text jump on Enter keypress */\r\n    resize: none;\r\n    min-height: $input-height;\r\n  }\r\n}\r\n\r\n// For textarea autoresize\r\n.hiddendiv {\r\n  display: none;\r\n  white-space: pre-wrap;\r\n  word-wrap: break-word;\r\n  overflow-wrap: break-word; /* future version of deprecated 'word-wrap' */\r\n  padding-top: 1.2rem; /* prevents text jump on Enter keypress */\r\n\r\n  // Reduces repaints\r\n  position: absolute;\r\n  top: 0;\r\n}\r\n\r\n\r\n/* Autocomplete */\r\n.autocomplete-content {\r\n  margin-top: -1 * $input-margin-bottom;\r\n  margin-bottom: $input-margin-bottom;\r\n  display: block;\r\n  opacity: 1;\r\n  position: static;\r\n\r\n  li {\r\n    .highlight { color: #444; }\r\n\r\n    img {\r\n      height: $dropdown-item-height - 10;\r\n      width: $dropdown-item-height - 10;\r\n      margin: 5px 15px;\r\n    }\r\n  }\r\n}\r\n","/* Radio Buttons\r\n   ========================================================================== */\r\n\r\n// Remove default Radio Buttons\r\n[type=\"radio\"]:not(:checked),\r\n[type=\"radio\"]:checked {\r\n  position: absolute;\r\n  opacity: 0;\r\n  pointer-events: none;\r\n}\r\n\r\n[type=\"radio\"]:not(:checked) + label,\r\n[type=\"radio\"]:checked + label {\r\n  position: relative;\r\n  padding-left: 35px;\r\n  cursor: pointer;\r\n  display: inline-block;\r\n  height: 25px;\r\n  line-height: 25px;\r\n  font-size: 1rem;\r\n  transition: .28s ease;\r\n  user-select: none;\r\n}\r\n\r\n[type=\"radio\"] + label:before,\r\n[type=\"radio\"] + label:after {\r\n  content: '';\r\n  position: absolute;\r\n  left: 0;\r\n  top: 0;\r\n  margin: 4px;\r\n  width: 16px;\r\n  height: 16px;\r\n  z-index: 0;\r\n  transition: .28s ease;\r\n}\r\n\r\n/* Unchecked styles */\r\n[type=\"radio\"]:not(:checked) + label:before,\r\n[type=\"radio\"]:not(:checked) + label:after,\r\n[type=\"radio\"]:checked + label:before,\r\n[type=\"radio\"]:checked + label:after,\r\n[type=\"radio\"].with-gap:checked + label:before,\r\n[type=\"radio\"].with-gap:checked + label:after {\r\n  border-radius: 50%;\r\n}\r\n\r\n[type=\"radio\"]:not(:checked) + label:before,\r\n[type=\"radio\"]:not(:checked) + label:after {\r\n  border: 2px solid $radio-empty-color;\r\n}\r\n\r\n[type=\"radio\"]:not(:checked) + label:after {\r\n  transform: scale(0);\r\n}\r\n\r\n/* Checked styles */\r\n[type=\"radio\"]:checked + label:before {\r\n  border: 2px solid transparent;\r\n}\r\n\r\n[type=\"radio\"]:checked + label:after,\r\n[type=\"radio\"].with-gap:checked + label:before,\r\n[type=\"radio\"].with-gap:checked + label:after {\r\n  border: $radio-border;\r\n}\r\n\r\n[type=\"radio\"]:checked + label:after,\r\n[type=\"radio\"].with-gap:checked + label:after {\r\n  background-color: $radio-fill-color;\r\n}\r\n\r\n[type=\"radio\"]:checked + label:after {\r\n  transform: scale(1.02);\r\n}\r\n\r\n/* Radio With gap */\r\n[type=\"radio\"].with-gap:checked + label:after {\r\n  transform: scale(.5);\r\n}\r\n\r\n/* Focused styles */\r\n[type=\"radio\"].tabbed:focus + label:before {\r\n  box-shadow: 0 0 0 10px rgba(0,0,0,.1);\r\n}\r\n\r\n/* Disabled Radio With gap */\r\n[type=\"radio\"].with-gap:disabled:checked + label:before {\r\n  border: 2px solid $input-disabled-color;\r\n}\r\n\r\n[type=\"radio\"].with-gap:disabled:checked + label:after {\r\n  border: none;\r\n  background-color: $input-disabled-color;\r\n}\r\n\r\n/* Disabled style */\r\n[type=\"radio\"]:disabled:not(:checked) + label:before,\r\n[type=\"radio\"]:disabled:checked + label:before {\r\n  background-color: transparent;\r\n  border-color: $input-disabled-color;\r\n}\r\n\r\n[type=\"radio\"]:disabled + label {\r\n  color: $input-disabled-color;\r\n}\r\n\r\n[type=\"radio\"]:disabled:not(:checked) + label:before {\r\n  border-color: $input-disabled-color;\r\n}\r\n\r\n[type=\"radio\"]:disabled:checked + label:after {\r\n  background-color: $input-disabled-color;\r\n  border-color: $input-disabled-solid-color;\r\n}\r\n","/* Checkboxes\r\n   ========================================================================== */\r\n\r\n/* CUSTOM CSS CHECKBOXES */\r\nform p {\r\n  margin-bottom: 10px;\r\n  text-align: left;\r\n}\r\n\r\nform p:last-child {\r\n  margin-bottom: 0;\r\n}\r\n\r\n/* Remove default checkbox */\r\n[type=\"checkbox\"]:not(:checked),\r\n[type=\"checkbox\"]:checked {\r\n  position: absolute;\r\n  opacity: 0;\r\n  pointer-events: none;\r\n}\r\n\r\n// Checkbox Styles\r\n[type=\"checkbox\"] {\r\n  // Text Label Style\r\n  + label {\r\n    position: relative;\r\n    padding-left: 35px;\r\n    cursor: pointer;\r\n    display: inline-block;\r\n    height: 25px;\r\n    line-height: 25px;\r\n    font-size: 1rem;\r\n    user-select: none;\r\n  }\r\n\r\n  /* checkbox aspect */\r\n  + label:before,\r\n  &:not(.filled-in) + label:after {\r\n    content: '';\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    width: 18px;\r\n    height: 18px;\r\n    z-index: 0;\r\n    border: 2px solid $radio-empty-color;\r\n    border-radius: 1px;\r\n    margin-top: 2px;\r\n    transition: .2s;\r\n  }\r\n\r\n  &:not(.filled-in) + label:after {\r\n    border: 0;\r\n    transform: scale(0);\r\n  }\r\n\r\n  &:not(:checked):disabled + label:before {\r\n    border: none;\r\n    background-color: $input-disabled-color;\r\n  }\r\n\r\n  // Focused styles\r\n  &.tabbed:focus + label:after {\r\n    transform: scale(1);\r\n    border: 0;\r\n    border-radius: 50%;\r\n    box-shadow: 0 0 0 10px rgba(0,0,0,.1);\r\n    background-color: rgba(0,0,0,.1);\r\n  }\r\n}\r\n\r\n[type=\"checkbox\"]:checked {\r\n  + label:before {\r\n    top: -4px;\r\n    left: -5px;\r\n    width: 12px;\r\n    height: 22px;\r\n    border-top: 2px solid transparent;\r\n    border-left: 2px solid transparent;\r\n    border-right: $radio-border;\r\n    border-bottom: $radio-border;\r\n    transform: rotate(40deg);\r\n    backface-visibility: hidden;\r\n    transform-origin: 100% 100%;\r\n  }\r\n\r\n  &:disabled + label:before {\r\n    border-right: 2px solid $input-disabled-color;\r\n    border-bottom: 2px solid $input-disabled-color;\r\n  }\r\n}\r\n\r\n/* Indeterminate checkbox */\r\n[type=\"checkbox\"]:indeterminate {\r\n  +label:before {\r\n    top: -11px;\r\n    left: -12px;\r\n    width: 10px;\r\n    height: 22px;\r\n    border-top: none;\r\n    border-left: none;\r\n    border-right: $radio-border;\r\n    border-bottom: none;\r\n    transform: rotate(90deg);\r\n    backface-visibility: hidden;\r\n    transform-origin: 100% 100%;\r\n  }\r\n\r\n  // Disabled indeterminate\r\n  &:disabled + label:before {\r\n    border-right: 2px solid $input-disabled-color;\r\n    background-color: transparent;\r\n  }\r\n}\r\n\r\n// Filled in Style\r\n[type=\"checkbox\"].filled-in {\r\n  // General\r\n  + label:after {\r\n    border-radius: 2px;\r\n  }\r\n\r\n  + label:before,\r\n  + label:after {\r\n    content: '';\r\n    left: 0;\r\n    position: absolute;\r\n    /* .1s delay is for check animation */\r\n    transition: border .25s, background-color .25s, width .20s .1s, height .20s .1s, top .20s .1s, left .20s .1s;\r\n    z-index: 1;\r\n  }\r\n\r\n  // Unchecked style\r\n  &:not(:checked) + label:before {\r\n    width: 0;\r\n    height: 0;\r\n    border: 3px solid transparent;\r\n    left: 6px;\r\n    top: 10px;\r\n    transform: rotateZ(37deg);\r\n    transform-origin: 100% 100%;\r\n  }\r\n\r\n  &:not(:checked) + label:after {\r\n    height: 20px;\r\n    width: 20px;\r\n    background-color: transparent;\r\n    border: 2px solid $radio-empty-color;\r\n    top: 0px;\r\n    z-index: 0;\r\n  }\r\n\r\n  // Checked style\r\n  &:checked {\r\n    + label:before {\r\n      top: 0;\r\n      left: 1px;\r\n      width: 8px;\r\n      height: 13px;\r\n      border-top: 2px solid transparent;\r\n      border-left: 2px solid transparent;\r\n      border-right: 2px solid $input-background;\r\n      border-bottom: 2px solid $input-background;\r\n      transform: rotateZ(37deg);\r\n      transform-origin: 100% 100%;\r\n    }\r\n\r\n    + label:after {\r\n      top: 0;\r\n      width: 20px;\r\n      height: 20px;\r\n      border: 2px solid $secondary-color;\r\n      background-color: $secondary-color;\r\n      z-index: 0;\r\n    }\r\n  }\r\n\r\n  // Focused styles\r\n  &.tabbed:focus + label:after {\r\n    border-radius: 2px;\r\n    border-color: $radio-empty-color;\r\n    background-color: rgba(0,0,0,.1);\r\n  }\r\n\r\n  &.tabbed:checked:focus + label:after {\r\n    border-radius: 2px;\r\n    background-color: $secondary-color;\r\n    border-color: $secondary-color;\r\n  }\r\n\r\n  // Disabled style\r\n  &:disabled:not(:checked) + label:before {\r\n    background-color: transparent;\r\n    border: 2px solid transparent;\r\n  }\r\n\r\n  &:disabled:not(:checked) + label:after {\r\n    border-color: transparent;\r\n    background-color: $input-disabled-solid-color;\r\n  }\r\n\r\n  &:disabled:checked + label:before {\r\n    background-color: transparent;\r\n  }\r\n\r\n  &:disabled:checked + label:after {\r\n    background-color: $input-disabled-solid-color;\r\n    border-color: $input-disabled-solid-color;\r\n  }\r\n}\r\n","/* Switch\r\n   ========================================================================== */\r\n\r\n.switch,\r\n.switch * {\r\n  -webkit-tap-highlight-color: transparent;\r\n  user-select: none;\r\n}\r\n\r\n.switch label {\r\n  cursor: pointer;\r\n}\r\n\r\n.switch label input[type=checkbox] {\r\n  opacity: 0;\r\n  width: 0;\r\n  height: 0;\r\n\r\n  &:checked + .lever {\r\n    background-color: $switch-checked-lever-bg;\r\n\r\n    &:before, &:after {\r\n      left: 18px;\r\n    }\r\n\r\n    &:after {\r\n      background-color: $switch-bg-color;\r\n    }\r\n  }\r\n}\r\n\r\n.switch label .lever {\r\n  content: \"\";\r\n  display: inline-block;\r\n  position: relative;\r\n  width: 36px;\r\n  height: 14px;\r\n  background-color: $switch-unchecked-lever-bg;\r\n  border-radius: $switch-radius;\r\n  margin-right: 10px;\r\n  transition: background 0.3s ease;\r\n  vertical-align: middle;\r\n  margin: 0 16px;\r\n\r\n  &:before, &:after {\r\n    content: \"\";\r\n    position: absolute;\r\n    display: inline-block;\r\n    width: 20px;\r\n    height: 20px;\r\n    border-radius: 50%;\r\n    left: 0;\r\n    top: -3px;\r\n    transition: left 0.3s ease, background .3s ease, box-shadow 0.1s ease, transform .1s ease;\r\n  }\r\n\r\n  &:before {\r\n    background-color: transparentize($switch-bg-color, .85);\r\n  }\r\n\r\n  &:after {\r\n    background-color: $switch-unchecked-bg;\r\n    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\r\n  }\r\n}\r\n\r\n// Switch active style\r\ninput[type=checkbox]:checked:not(:disabled) ~ .lever:active::before,\r\ninput[type=checkbox]:checked:not(:disabled).tabbed:focus ~ .lever::before {\r\n  transform: scale(2.4);\r\n  background-color: transparentize($switch-bg-color, .85);\r\n}\r\n\r\ninput[type=checkbox]:not(:disabled) ~ .lever:active:before,\r\ninput[type=checkbox]:not(:disabled).tabbed:focus ~ .lever::before {\r\n  transform: scale(2.4);\r\n  background-color: rgba(0,0,0,.08);\r\n}\r\n\r\n// Disabled Styles\r\n.switch input[type=checkbox][disabled] + .lever {\r\n  cursor: default;\r\n  background-color: rgba(0,0,0,.12);\r\n}\r\n\r\n.switch label input[type=checkbox][disabled] + .lever:after,\r\n.switch label input[type=checkbox][disabled]:checked + .lever:after {\r\n  background-color: $input-disabled-solid-color;\r\n}\r\n","/* Select Field\r\n   ========================================================================== */\r\n\r\nselect { display: none; }\r\nselect.browser-default { display: block; }\r\n\r\nselect {\r\n  background-color: $select-background;\r\n  width: 100%;\r\n  padding: $select-padding;\r\n  border: $select-border;\r\n  border-radius: $select-radius;\r\n  height: $input-height;\r\n}\r\n\r\n\r\n.input-field {\r\n  & > select {\r\n    display: block;\r\n    position: absolute;\r\n    width: 0;\r\n    pointer-events: none;\r\n    height: 0;\r\n    top: 0;\r\n    left: 0;\r\n    opacity: 0;\r\n  }\r\n}\r\n\r\n.select-label {\r\n  position: absolute;\r\n}\r\n\r\n.select-wrapper {\r\n  &.valid {\r\n    & > input.select-dropdown {\r\n      @extend %valid-input-style;\r\n    }\r\n\r\n    & + label:after {\r\n      @extend %custom-success-message;\r\n    }\r\n  }\r\n\r\n  &.invalid {\r\n    & > input.select-dropdown {\r\n      @extend %invalid-input-style;\r\n    }\r\n\r\n    & + label:after {\r\n      @extend %custom-error-message;\r\n    }\r\n  }\r\n\r\n  &.valid + label,\r\n  &.invalid + label {\r\n    width: 100%;\r\n    pointer-events: none;\r\n  }\r\n\r\n  & + label:after {\r\n    @extend %input-after-style;\r\n  }\r\n\r\n  position: relative;\r\n\r\n  input.select-dropdown {\r\n    position: relative;\r\n    cursor: pointer;\r\n    background-color: transparent;\r\n    border: none;\r\n    border-bottom: $input-border;\r\n    outline: none;\r\n    height: $input-height;\r\n    line-height: $input-height;\r\n    width: 100%;\r\n    font-size: $input-font-size;\r\n    margin: $input-margin;\r\n    padding: 0;\r\n    display: block;\r\n    user-select:none;\r\n  }\r\n\r\n  span.caret {\r\n    color: initial;\r\n    position: absolute;\r\n    right: 0;\r\n    top: 0;\r\n    bottom: 0;\r\n    height: 10px;\r\n    margin: auto 0;\r\n    font-size: 10px;\r\n    line-height: 10px;\r\n  }\r\n\r\n  & + label {\r\n    position: absolute;\r\n    top: -26px;\r\n    font-size: $label-font-size;\r\n  }\r\n}\r\n\r\n// Disabled styles\r\nselect:disabled {\r\n  color: $input-disabled-color;\r\n}\r\n\r\n.select-wrapper.disabled {\r\n  span.caret,\r\n  & + label {\r\n    color: $input-disabled-color;\r\n  }\r\n}\r\n\r\n.select-wrapper input.select-dropdown:disabled {\r\n  color: $input-disabled-color;\r\n  cursor: default;\r\n  user-select: none;\r\n}\r\n\r\n.select-wrapper i {\r\n  color: $select-disabled-color;\r\n}\r\n\r\n.select-dropdown li.disabled,\r\n.select-dropdown li.disabled > span,\r\n.select-dropdown li.optgroup {\r\n  color: $select-disabled-color;\r\n  background-color: transparent;\r\n}\r\n\r\n.select-dropdown.dropdown-content {\r\n  li {\r\n    &.active {\r\n      background-color: transparent;\r\n    }\r\n\r\n    &:hover {\r\n      background-color: $select-option-hover;\r\n    }\r\n\r\n    &.selected {\r\n      background-color: $select-option-focus;\r\n    }\r\n  }\r\n}\r\n\r\n// Prefix Icons\r\n.prefix ~ .select-wrapper {\r\n  margin-left: 3rem;\r\n  width: 92%;\r\n  width: calc(100% - 3rem);\r\n}\r\n\r\n.prefix ~ label { margin-left: 3rem; }\r\n\r\n// Icons\r\n.select-dropdown li {\r\n  img {\r\n    height: $dropdown-item-height - 10;\r\n    width: $dropdown-item-height - 10;\r\n    margin: 5px 15px;\r\n    float: right;\r\n  }\r\n}\r\n\r\n// Optgroup styles\r\n.select-dropdown li.optgroup {\r\n  border-top: 1px solid $dropdown-hover-bg-color;\r\n\r\n  &.selected > span {\r\n    color: rgba(0, 0, 0, .7);\r\n  }\r\n\r\n  & > span {\r\n    color: rgba(0, 0, 0, .4);\r\n  }\r\n\r\n  & ~ li.optgroup-option {\r\n    padding-left: 1rem;\r\n  }\r\n}\r\n","/* File Input\r\n   ========================================================================== */\r\n\r\n.file-field {\r\n  position: relative;\r\n\r\n  .file-path-wrapper {\r\n    overflow: hidden;\r\n    padding-left: 10px;\r\n  }\r\n\r\n  input.file-path { width: 100%; }\r\n\r\n  .btn {\r\n    float: left;\r\n    height: $input-height;\r\n    line-height: $input-height;\r\n  }\r\n\r\n  span {\r\n    cursor: pointer;\r\n  }\r\n\r\n  input[type=file] {\r\n\r\n    // Needed to override webkit button\r\n    &::-webkit-file-upload-button {\r\n      display: none;\r\n    }\r\n\r\n    position: absolute;\r\n    top: 0;\r\n    right: 0;\r\n    left: 0;\r\n    bottom: 0;\r\n    width: 100%;\r\n    margin: 0;\r\n    padding: 0;\r\n    font-size: 20px;\r\n    cursor: pointer;\r\n    opacity: 0;\r\n    filter: alpha(opacity=0);\r\n  }\r\n}\r\n","/* Range\r\n   ========================================================================== */\r\n\r\n.range-field {\r\n  position: relative;\r\n}\r\n\r\ninput[type=range],\r\ninput[type=range] + .thumb {\r\n  @extend .no-select;\r\n  cursor: pointer;\r\n}\r\n\r\ninput[type=range] {\r\n  position: relative;\r\n  background-color: transparent;\r\n  border: none;\r\n  outline: none;\r\n  width: 100%;\r\n  margin: 15px 0;\r\n  padding: 0;\r\n\r\n  &:focus {\r\n    outline: none;\r\n  }\r\n}\r\n\r\ninput[type=range] + .thumb {\r\n  position: absolute;\r\n  top: 10px;\r\n  left: 0;\r\n  border: none;\r\n  height: 0;\r\n  width: 0;\r\n  border-radius: 50%;\r\n  background-color: $radio-fill-color;\r\n  margin-left: 7px;\r\n\r\n  transform-origin: 50% 50%;\r\n  transform: rotate(-45deg);\r\n\r\n  .value {\r\n    display: block;\r\n    width: 30px;\r\n    text-align: center;\r\n    color: $radio-fill-color;\r\n    font-size: 0;\r\n    transform: rotate(45deg);\r\n  }\r\n\r\n  &.active {\r\n    border-radius: 50% 50% 50% 0;\r\n\r\n    .value {\r\n      color: $input-background;\r\n      margin-left: -1px;\r\n      margin-top: 8px;\r\n      font-size: 10px;\r\n    }\r\n  }\r\n}\r\n\r\n// WebKit\r\ninput[type=range] {\r\n  -webkit-appearance: none;\r\n}\r\n\r\ninput[type=range]::-webkit-slider-runnable-track {\r\n  height: $track-height;\r\n  background: #c2c0c2;\r\n  border: none;\r\n}\r\n\r\ninput[type=range]::-webkit-slider-thumb {\r\n  -webkit-appearance: none;\r\n  border: none;\r\n  height: $range-height;\r\n  width: $range-width;\r\n  border-radius: 50%;\r\n  background-color: $radio-fill-color;\r\n  transform-origin: 50% 50%;\r\n  margin: -5px 0 0 0;\r\n  transition: .3s;\r\n}\r\n\r\ninput[type=range]:focus::-webkit-slider-runnable-track {\r\n  background: #ccc;\r\n}\r\n\r\n// FireFox\r\ninput[type=range] {\r\n  /* fix for FF unable to apply focus style bug  */\r\n  border: 1px solid white;\r\n\r\n  /*required for proper track sizing in FF*/\r\n}\r\n\r\ninput[type=range]::-moz-range-track {\r\n  height: $track-height;\r\n  background: #ddd;\r\n  border: none;\r\n}\r\n\r\ninput[type=range]::-moz-range-thumb {\r\n  border: none;\r\n  height: $range-height;\r\n  width: $range-width;\r\n  border-radius: 50%;\r\n  background: $radio-fill-color;\r\n  margin-top: -5px;\r\n}\r\n\r\n// hide the outline behind the border\r\ninput[type=range]:-moz-focusring {\r\n  outline: 1px solid #fff;\r\n  outline-offset: -1px;\r\n}\r\n\r\ninput[type=range]:focus::-moz-range-track {\r\n  background: #ccc;\r\n}\r\n\r\n// IE 10+\r\ninput[type=range]::-ms-track {\r\n  height: $track-height;\r\n\r\n  // remove bg colour from the track, we'll use ms-fill-lower and ms-fill-upper instead\r\n  background: transparent;\r\n\r\n  // leave room for the larger thumb to overflow with a transparent border */\r\n  border-color: transparent;\r\n  border-width: 6px 0;\r\n\r\n  /*remove default tick marks*/\r\n  color: transparent;\r\n}\r\n\r\ninput[type=range]::-ms-fill-lower {\r\n  background: #777;\r\n}\r\n\r\ninput[type=range]::-ms-fill-upper {\r\n  background: #ddd;\r\n}\r\n\r\ninput[type=range]::-ms-thumb {\r\n  border: none;\r\n  height: $range-height;\r\n  width: $range-width;\r\n  border-radius: 50%;\r\n  background: $radio-fill-color;\r\n}\r\n\r\ninput[type=range]:focus::-ms-fill-lower {\r\n  background: #888;\r\n}\r\n\r\ninput[type=range]:focus::-ms-fill-upper {\r\n  background: #ccc;\r\n}\r\n","/** Colors */\n$color-blue: #006993;\n$color-blue-dark: darken($color-blue, 10%);\n$color-blue-light: #c9d9e3;\n$color-orange: #f68026;\n$color-orange-dark: darken($color-orange, 10%);\n$color-green: #b7d331;\n$color-green-dark: darken($color-green, 10%);\n$color-yellow: #e3b831;\n$color-yellow-dark: darken($color-yellow, 10%);\n$color-gray-dark: #404040;\n$color-gray-medium: #909090;\n$color-gray-light: #dcd8d8;\n$color-black: #000;\n$color-white: #fff;\n\n/** Fonts */\n$font-sans: 'Montserrat', sans-serif;\n\n/** Font Sizes */\n$size-small: 15px;\n$size-regular: 18px;\n$size-medium: 20px;\n$size-large: 30px;\n$size-extralarge: 35px;\n\n/** Box Model  */\n$spacer:  2rem;\n\n/** Modified Grid */\n$xsmall-screen: 600px;\n$xsmall-screen-up: 601px;\n$small-screen-up: 769px;\n$medium-screen-up: 993px;\n$large-screen-up: 1201px;\n$small-screen: 768px;\n$medium-screen: 992px;\n$large-screen: 1200px;\n$small-and-up: \"only screen and (min-width : #{$xsmall-screen-up})\";\n$xsmall-and-down: \"only screen and (max-width : #{$xsmall-screen})\";\n\n/** Flow Text  */\n$range : $large-screen - $medium-screen;\n$intervals: 18;\n$interval-size: $range / $intervals;\n\n/** Gradients */\n// Utility mixin from Compass\n@mixin filter-gradient($start-color, $end-color, $orientation: vertical) {\n  $gradient-type: if($orientation == vertical, 0, 1);\n\n  filter: progid:DXImageTransform.Microsoft.gradient(gradientType=#{$gradient-type}, startColorstr='#{ie-hex-str($start-color)}', endColorstr='#{ie-hex-str($end-color)}');\n}\n\n@mixin triangle($direction, $color) {\n  background-image: -o-linear-gradient(to #{$direction}, transparent 0%, transparent 50%, #{$color} 50%);\n  background-image: -moz-linear-gradient(to #{$direction}, transparent 0%, transparent 50%, #{$color} 50%);\n  background-image: -ms-linear-gradient(to #{$direction}, transparent 0%, transparent 50%, #{$color} 50%);\n  background-image: linear-gradient(to #{$direction}, transparent 0%, transparent 50%, #{$color} 50%);\n}\n\n// Rem-calc function from Zurb\n$rem-base: 18px;\n\n@function strip-unit($num) {\n  @return $num / ($num * 0 + 1);\n}\n\n@function convert-to-rem($value, $base-value: $rem-base) {\n  $value: strip-unit($value) / strip-unit($base-value) * 1rem;\n\n  @return $value;\n}\n\n@function rem-calc($values, $base-value: $rem-base) {\n  $max: length($values);\n\n  @if $max == 1 { @return convert-to-rem(nth($values, 1), $base-value); }\n\n  $remValues: ();\n\n  @for $i from 1 through $max {\n    $remValues: append($remValues, convert-to-rem(nth($values, $i), $base-value));\n  }\n\n  @return $remValues;\n}\n\n// em-calc function modified from rem-calc\n$em-base: 18px;\n\n@function strip-unit($num) {\n  @return $num / ($num * 0 + 1);\n}\n\n@function convert-to-em($value, $base-value: $em-base) {\n  $value: strip-unit($value) / strip-unit($base-value) * 1em;\n\n  @return $value;\n}\n\n@function em-calc($values, $base-value: $em-base) {\n  $max: length($values);\n\n  @if $max == 1 { @return convert-to-em(nth($values, 1), $base-value); }\n\n  $emValues: ();\n\n  @for $i from 1 through $max {\n    $emValues: append($emValues, convert-to-em(nth($values, $i), $base-value));\n  }\n\n  @return $emValues;\n}\n","html {\n  font-size: 18px;\n\n  &[data-text-size=\"medium\"] {\n    font-size: 20px;\n  }\n\n  &[data-text-size=\"large\"] {\n    font-size: 24px;\n  }\n\n  @media #{$small-and-down} {\n    font-size: 16px;\n  }\n}\n\nbody {\n  font-family: $font-sans;\n}\n\n* {\n  box-sizing: border-box;\n}\n\n.container {\n  @media #{$medium-and-up} {\n    width: 95%;\n  }\n\n  @media #{$large-and-up} {\n    width: 90%;\n  }\n}\n\n.content {\n  position: relative;\n  z-index: 3;\n}\n\n.flex {\n  display: flex;\n\n  @media #{$small-and-down} {\n    flex-wrap: wrap;\n  }\n}\n\n.flex-center {\n  align-items: center;\n}\n\n.flex-end {\n  justify-content: flex-end;\n}\n\n.flex-bottom {\n  align-items: flex-end;\n}\n\n.flex-wrap {\n  flex-wrap: wrap;\n}\n\n.flex-grid {\n  display: flex;\n  flex-wrap: wrap;\n\n  .flex-item {\n    padding: 10px;\n  }\n\n  &.s1x {\n    .flex-item {\n      display: flex;\n      position: relative;\n\n      @media #{$xsmall-and-down} {\n        width: 100%;\n      }\n    }\n  }\n\n  &.m2x {\n    .flex-item {\n      display: flex;\n      position: relative;\n\n      @media #{$small-and-up} {\n        width: 50%;\n      }\n    }\n  }\n}\n\n.space-between {\n  justify-content: space-between;\n}\n\n.space-evenly {\n  justify-content: space-evenly;\n}\n\n.mega-link.mega-link {\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 5;\n}\n\n@media #{$xsmall-and-down} {\n  .row .col.xs12 {\n    width: 100%;\n  }\n}\n\nimg {\n  max-width: 100%;\n  height: auto;\n}\n\n@mixin cover {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n}\n\n.page .main {\n  margin-bottom: 2rem;\n}\n","h1 {\n  font-size: $size-extralarge;\n  text-transform: uppercase;\n  text-align: center;\n  color: $color-blue;\n}\n\nh2 {\n  font-size: $size-large;\n  text-transform: uppercase;\n  text-align: center;\n  color: $color-blue;\n}\n\nh3 {\n  font-size: $size-medium;\n  color: $color-blue;\n}\n\na {\n  color: $color-blue;\n}\n",".screen-reader-text {\n  clip: rect(1px, 1px, 1px, 1px);\n  clip-path: polygon(0 0, 0 0, 0 0, 0 0);\n  position: absolute !important;\n  white-space: nowrap;\n  height: 1px;\n  width: 1px;\n  overflow: hidden;\n\n  &:focus {\n    clip: auto;\n    clip-path: none;\n    display: block;\n    height: auto;\n    left: 5px;\n    top: 5px;\n    width: auto;\n    z-index: 100000; /* Above WP toolbar. */\n  }\n}\n\n.a11y-tools-trigger-wrapper {\n  position: absolute;\n  right: 5%;\n  top: 5px;\n  transition: top 0.3s ease;\n\n  @media #{$small-and-down} {\n    .a11y-tools-active & {\n      top: 125px;\n    }\n  }\n\n  input:focus + label {\n    outline: $color-gray-dark auto 5px;\n  }\n\n  label {\n    display: block;\n    background: $color-black;\n    border-radius: 100%;\n    width: 50px;\n    height: 50px;\n    text-align: center;\n    cursor: pointer;\n    transition: background 0.3s ease;\n\n    i {\n      position: absolute;\n      left: 0;\n      width: 100%;\n      top: 50%;\n      transform: translateY(-50%);\n      color: $color-white;\n    }\n\n    span {\n      display: none;\n    }\n\n    &:hover {\n      background: $color-blue-dark;\n    }\n\n    html[data-contrast=\"true\"] & {\n      border: 3px solid $color-white;\n\n      &:hover {\n        background: $color-white;\n\n        i {\n          color: $color-black;\n        }\n      }\n    }\n  }\n}\n\n.a11y-tools {\n  height: 50px;\n  overflow: hidden;\n  transition: height 0.3s ease;\n  position: relative;\n\n  @media #{$small-and-down} {\n    height: 0;\n\n    .a11y-tools-active & {\n      height: 110px;\n    }\n  }\n\n  html[data-contrast=\"true\"] & {\n    border-bottom: 1px solid $color-white;\n  }\n\n  .container {\n    @media #{$large-and-up} {\n      padding-right: 15px;\n    }\n  }\n\n  fieldset {\n    border: none;\n    padding: 0;\n    margin: 0;\n\n    @media #{$small-and-down} {\n      padding-bottom: 10px;\n    }\n\n    legend, & > div {\n      display: block;\n      float: left;\n      padding: 0 3px;\n    }\n\n    legend {\n      width: 65px;\n      font-size: 12px;\n      padding-top: 8px;\n\n      @media #{$xsmall-and-down} {\n        display: none;\n      }\n    }\n\n    label {\n      display: block;\n      text-indent: -100em;\n      overflow: hidden;\n      width: 50px;\n      height: 50px;\n      position: relative;\n      background: $color-gray-light;\n      transition: background 0.3s ease;\n      cursor: pointer;\n\n      &::after {\n        position: absolute;\n        left: 0;\n        width: 100%;\n        color: $color-black;\n      }\n\n      &:hover {\n        background: $color-gray-medium;\n\n        &::after {\n          color: $color-white;\n        }\n      }\n\n      html[data-contrast=\"true\"] & {\n        background: $color-black;\n        border: 1px solid $color-white;\n\n        &::after {\n          color: $color-white;\n        }\n\n        &:hover, &:focus {\n          background: $color-white;\n\n          &::after {\n            color: $color-black;\n          }\n        }\n      }\n    }\n\n    input {\n      &[type=\"radio\"] {\n        &:checked + label {\n          background: $color-blue-light;\n\n          &::after {\n            color: $color-white;\n          }\n\n          html[data-contrast=\"true\"] & {\n            background: $color-gray-dark;\n          }\n        }\n\n        &:focus + label {\n          outline: $color-gray-dark auto 5px;\n\n          html[data-contrast=\"true\"] & {\n            outline: $color-white auto 5px;\n          }\n        }\n      }\n\n      &[type=\"checkbox\"] {\n        &:checked + label {\n          background: $color-blue-light;\n\n          &::after {\n            background-image: url('../images/icon-contrast-inverse.svg');\n          }\n\n          html[data-contrast=\"true\"] & {\n            background: $color-gray-dark;\n\n            &:hover, &:focus {\n              background: $color-gray-medium;\n            }\n          }\n        }\n\n        &:focus + label {\n          outline: $color-gray-dark auto 5px;\n\n          html[data-contrast=\"true\"] & {\n            outline: $color-white auto 5px;\n          }\n        }\n      }\n    }\n\n    &.toggle-contrast {\n      label {\n        &::after {\n          content: '';\n          top: 0;\n          height: 100%;\n          background: url('../images/icon-contrast.svg') no-repeat 50% 50%;\n        }\n      }\n    }\n\n    &.text-size {\n      label {\n        &::after {\n          content: 'A';\n          top: 50%;\n          transform: translateY(-50%);\n          text-indent: 0;\n          text-align: center;\n          transition: color 0.3s ease;\n          speak: none;\n        }\n      }\n\n      div[class*=\"default-\"] label::after {\n        font-size: 18px;\n      }\n\n      div[class*=\"medium-\"] label::after {\n        font-size: 24px;\n      }\n\n      div[class*=\"large-\"] label::after {\n        font-size: 27px;\n      }\n    }\n  }\n\n  .search-form {\n    margin-left: 6px;\n    width: auto;\n    align-self: flex-start;\n\n    .label {\n      float: left;\n      width: 45px;\n      white-space: normal;\n      padding-top: 8px;\n      font-size: 12px;\n      line-height: 1.5;\n      font-family: $font-sans;\n      font-weight: normal;\n    }\n\n    .search-field {\n      float: left;\n      overflow: hidden;\n      transition: all 0.3s ease;\n      width: 0;\n      padding: 0;\n    }\n\n    &.active {\n      .search-field {\n        width: 200px;\n        padding: 0 10px;\n      }\n    }\n\n    @media #{$small-and-down} {\n      .search-field {\n        width: 250px;\n        padding: 0 10px;\n      }\n    }\n\n    @media #{$xsmall-and-down} {\n      margin-left: 0;\n\n      .label {\n        display: none;\n      }\n\n      .search-field {\n        width: 225px;\n      }\n    }\n\n    html[data-contrast=\"true\"] & {\n      .label {\n        color: $color-white;\n      }\n    }\n  }\n}\n\nhtml[data-contrast=\"true\"] {\n  background: $color-black;\n  color: $color-white;\n\n  .banner .navbar, .page-footer .footer-copyright {\n    background: $color-black;\n    border-top: 1px solid $color-white;\n    border-bottom: 1px solid $color-white;\n  }\n\n  .navbar-menu li.current-page-ancestor, .navbar-menu li.current-menu-item,\n  .navbar-menu li:hover, .navbar-menu li:focus, .navbar-menu li.hover {\n    background: $color-gray-dark;\n    border-right: 1px solid $color-white;\n    border-left: 1px solid $color-white;\n  }\n\n  .btn, .social-icons li a, .page-footer .widget_nav_menu .menu li a {\n    background: $color-black;\n    border-color: $color-white;\n\n    &:hover, &:focus {\n      background: $color-white;\n      color: $color-black;\n    }\n  }\n\n  select, input[type=\"text\"] {\n    border-color: $color-white;\n    background: $color-black;\n    color: $color-white;\n  }\n\n  h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6, a {\n    color: $color-white;\n  }\n\n  .banner .logo img {\n    background-size: contain;\n    display: block;\n    box-sizing: border-box;\n    padding-left: 100%;\n    padding-top: 27.65%;\n    overflow: hidden;\n  }\n\n  .events-list.events-list time, .single-mc-events time {\n    background: $color-black;\n    border-color: $color-gray-dark;\n  }\n}\n","@mixin button($color1, $color2) {\n  background-color: $color1;\n  background-image: linear-gradient(to bottom right, transparent 0, transparent 50%, $color2 50%, $color2 100%);\n\n  &:hover {\n    background-color: $color2;\n  }\n}\n\n.btn {\n  @include button($color-orange, $color-orange-dark);\n\n  padding: 1em;\n  text-align: center;\n  margin: 1em 0;\n  line-height: 28px;\n  width: 300px;\n  height: 60px;\n  font-size: 18px;\n\n  &:active, &:focus {\n    border: 1px solid black;\n  }\n}\n","/** Search form */\n// TODO: .search-form {}\n// TODO: .search-form label {}\n// TODO: .search-form .search-field {}\n// TODO: .search-form .search-submit {}\n","/**\n * WordPress Generated Classes\n * @see http://codex.wordpress.org/CSS#WordPress_Generated_Classes\n */\n\n/** Media alignment */\n.alignnone {\n  margin-left: 0;\n  margin-right: 0;\n  max-width: 100%;\n  height: auto;\n}\n\n.aligncenter {\n  display: block;\n  margin: ($spacer / 2) auto;\n  height: auto;\n}\n\n.alignleft,\n.alignright {\n  margin-bottom: ($spacer / 2);\n  height: auto;\n}\n\n@media (min-width: 30rem) {\n  .alignleft {\n    float: left;\n    margin-right: ($spacer / 2);\n  }\n\n  .alignright {\n    float: right;\n    margin-left: ($spacer / 2);\n  }\n}\n\n/** Captions */\n\n// TODO: .wp-caption {}\n// TODO: .wp-caption img {}\n// TODO: .wp-caption-text {}\n\n/** Text meant only for screen readers */\n.screen-reader-text {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  border: 0;\n  color: #000;\n  background: #fff;\n}\n",".nav-primary {\n  background: $color-blue;\n  font-weight: 300;\n\n  ul {\n    display: flex;\n    justify-content: space-around;\n  }\n}\n",".unity-link {\n  display: inline-block;\n  max-width: 120px;\n  max-height: 23px;\n  float: right;\n}\n\n.svg-unity-logo {\n  width: 100%;\n  height: auto;\n  max-height: 23px;\n  display: inline-block;\n  vertical-align: middle;\n\n  path {\n    fill: $color-white;\n  }\n}\n","#menu-social-menu {\n  display: flex;\n  justify-content: center;\n\n  li {\n    a {\n      display: block;\n      position: relative;\n      height: 40px;\n      width: 40px;\n      margin: 0 7px;\n\n      &::before {\n        content: '';\n        position: absolute;\n        top: 0;\n        left: 0;\n        width: 40px;\n        height: 40px;\n        background-repeat: no-repeat;\n        background-size: contain;\n        background-position: center;\n      }\n    }\n\n    &.facebook-footer a::before {\n      background-image: url('../images/facebook.svg');\n    }\n\n    &.instagram-footer a::before {\n      background-image: url('../images/instagram.svg');\n    }\n\n    &.twitter-footer a::before {\n      background-image: url('../images/twitter.svg');\n    }\n  }\n}\n","header {\n  display: flex;\n  justify-content: space-around;\n  align-items: center;\n}\n","footer {\n  background: $color-blue;\n  color: $color-white;\n  padding: 5px 1em;\n  font-weight: 300;\n  padding-top: 1.5em;\n\n  .m4:nth-of-type(2) {\n    text-align: center;\n  }\n\n  .m4:nth-of-type(3) {\n    text-align: right;\n  }\n\n  .row {\n    margin-bottom: 0;\n  }\n\n  .textwidget p {\n    margin: 0;\n  }\n}\n\n.footer-copyright {\n  background: $color-blue-dark;\n  color: $color-white;\n  font-weight: 300;\n  font-size: $size-small;\n  padding: 5px 1em;\n\n  a {\n    color: white;\n  }\n\n  .row {\n    margin-bottom: 0;\n  }\n\n  .m4:nth-of-type(2) {\n    text-align: center;\n  }\n}\n","body#tinymce {\n  margin: 12px !important;\n}\n",".home {\n  .hero {\n    text-align: center;\n    margin-bottom: 2em;\n\n    img {\n      width: 100%;\n      height: 400px;\n      object-fit: cover;\n    }\n\n    .btn {\n      &:nth-of-type(2) {\n        @include button($color-blue, $color-blue-dark);\n      }\n\n      &:nth-of-type(3) {\n        @include button($color-green, $color-green-dark);\n      }\n\n      &:nth-of-type(4) {\n        @include button($color-yellow, $color-yellow-dark);\n      }\n    }\n  }\n\n  .services {\n    background: $color-blue-light;\n    padding: 2em 0;\n\n    .service-item {\n      height: 250px;\n      position: relative;\n      background-size: cover;\n      margin-bottom: 1em;\n      box-shadow: 0 2px 4px rgba($color-black, 0.5);\n\n      h3 {\n        background: $color-white;\n        padding: 1em;\n        margin: 0;\n        position: absolute;\n        bottom: 0;\n        left: 0;\n        width: 100%;\n        text-align: center;\n      }\n    }\n  }\n\n  .overview {\n    h2 {\n      text-align: left;\n    }\n  }\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 17 */
/*!****************************************************************************************!*\
  !*** multi ./build/util/../helpers/hmr-client.js ./scripts/main.js ./styles/main.scss ***!
  \****************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! /Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/resources/assets/build/util/../helpers/hmr-client.js */2);
__webpack_require__(/*! ./scripts/main.js */18);
module.exports = __webpack_require__(/*! ./styles/main.scss */25);


/***/ }),
/* 18 */
/*!*************************!*\
  !*** ./scripts/main.js ***!
  \*************************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(jQuery) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(/*! jquery */ 1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_Router__ = __webpack_require__(/*! ./util/Router */ 19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__routes_common__ = __webpack_require__(/*! ./routes/common */ 21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__routes_home__ = __webpack_require__(/*! ./routes/home */ 22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__routes_about__ = __webpack_require__(/*! ./routes/about */ 23);
// import external dependencies


// Import everything from autoload


// import local dependencies





// Web font loader
var WebFont = __webpack_require__(/*! webfontloader */ 24);

WebFont.load({
 google: {
   families: ['Montserrat:300,400,400i,700,700i', 'Material+Icons'],
 },
});

/** Populate Router instance with DOM routes */
var routes = new __WEBPACK_IMPORTED_MODULE_1__util_Router__["a" /* default */]({
  // All pages
  common: __WEBPACK_IMPORTED_MODULE_2__routes_common__["a" /* default */],
  // Home page
  home: __WEBPACK_IMPORTED_MODULE_3__routes_home__["a" /* default */],
  // About Us page, note the change from about-us to aboutUs.
  aboutUs: __WEBPACK_IMPORTED_MODULE_4__routes_about__["a" /* default */],
});

// Load Events
jQuery(document).ready(function () { return routes.loadEvents(); });

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 1)))

/***/ }),
/* 19 */
/*!********************************!*\
  !*** ./scripts/util/Router.js ***!
  \********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__camelCase__ = __webpack_require__(/*! ./camelCase */ 20);


/**
 * DOM-based Routing
 *
 * Based on {@link http://goo.gl/EUTi53|Markup-based Unobtrusive Comprehensive DOM-ready Execution} by Paul Irish
 *
 * The routing fires all common scripts, followed by the page specific scripts.
 * Add additional events for more control over timing e.g. a finalize event
 */
var Router = function Router(routes) {
  this.routes = routes;
};

/**
 * Fire Router events
 * @param {string} route DOM-based route derived from body classes (`<body class="...">`)
 * @param {string} [event] Events on the route. By default, `init` and `finalize` events are called.
 * @param {string} [arg] Any custom argument to be passed to the event.
 */
Router.prototype.fire = function fire (route, event, arg) {
    if ( event === void 0 ) event = 'init';

  var fire = route !== '' && this.routes[route] && typeof this.routes[route][event] === 'function';
  if (fire) {
    this.routes[route][event](arg);
  }
};

/**
 * Automatically load and fire Router events
 *
 * Events are fired in the following order:
 ** common init
 ** page-specific init
 ** page-specific finalize
 ** common finalize
 */
Router.prototype.loadEvents = function loadEvents () {
    var this$1 = this;

  // Fire common init JS
  this.fire('common');

  // Fire page-specific init JS, and then finalize JS
  document.body.className
    .toLowerCase()
    .replace(/-/g, '_')
    .split(/\s+/)
    .map(__WEBPACK_IMPORTED_MODULE_0__camelCase__["a" /* default */])
    .forEach(function (className) {
      this$1.fire(className);
      this$1.fire(className, 'finalize');
    });

  // Fire common finalize JS
  this.fire('common', 'finalize');
};

/* harmony default export */ __webpack_exports__["a"] = (Router);


/***/ }),
/* 20 */
/*!***********************************!*\
  !*** ./scripts/util/camelCase.js ***!
  \***********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * the most terrible camelizer on the internet, guaranteed!
 * @param {string} str String that isn't camel-case, e.g., CAMeL_CaSEiS-harD
 * @return {string} String converted to camel-case, e.g., camelCaseIsHard
 */
/* harmony default export */ __webpack_exports__["a"] = (function (str) { return ("" + (str.charAt(0).toLowerCase()) + (str.replace(/[\W_]/g, '|').split('|')
  .map(function (part) { return ("" + (part.charAt(0).toUpperCase()) + (part.slice(1))); })
  .join('')
  .slice(1))); });;


/***/ }),
/* 21 */
/*!**********************************!*\
  !*** ./scripts/routes/common.js ***!
  \**********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony default export */ __webpack_exports__["a"] = ({
  init: function init() {
    /**
     * Set aria labels for current navigation items
     */
    // Main navigation in header and footer
    $('.menu-primary-menu-container .menu-item').each(function() {
      if ($(this).hasClass('current-page-ancestor')) {
        $(this).children('a').attr('aria-current', 'true');
      }
      if ($(this).hasClass('current-menu-item')) {
        $(this).children('a').attr('aria-current', 'page');
      }
    });
    // Sidebar navigation
    $('.widget_nav_menu .menu-item').each(function() {
      if ($(this).hasClass('current-page-ancestor')) {
        $(this).children('a').attr('aria-current', 'true');
      }
      if ($(this).hasClass('current-menu-item')) {
        $(this).children('a').attr('aria-current', 'page');
      }
    });

    /**
     * Add mobile trigger for sidebar navigation
     */
    $('.sidebar .widget_nav_menu > div[class*="menu-"]').prepend('<button class="sidebar-nav-trigger hide-on-med-and-up" id="sidebar-nav-trigger">Select Page <i class="material-icons">keyboard_arrow_down</i></button>');
  },
  finalize: function finalize() {
    var smDown = window.matchMedia( "(max-width: 768px)" );

    // Activate search box
    function activateSearch() {
      $('.a11y-tools .search-form').addClass('active');
      $('.a11y-tools .search-form .search-submit').removeClass('disabled');
    }

    // Deactivate search box
    function deactivateSearch() {
      $('.a11y-tools .search-form').removeClass('active');
      $('.a11y-tools .search-form .search-submit').addClass('disabled');
    }

    // Show a11y toolbar
    function showA11yToolbar() {
      $('body').addClass('a11y-tools-active');
      $('#a11y-tools-trigger + label i').attr('aria-label', 'Hide accessibility tools');

      // Enable focus of tools using tabindex
      $('.a11y-tools').each(function() {
        var el = $(this);
        $('input', el).attr('tabindex', '0');
      });
    }

    // Hide a11y toolbar
    function hideA11yToolbar() {
      $('body').removeClass('a11y-tools-active');
      $('#a11y-tools-trigger + label i').attr('aria-label', 'Show accessibility tools');

      // Disable focus of tools using tabindex
      $('.a11y-tools').each(function() {
        var el = $(this);
        $('input', el).attr('tabindex', '-1');
      });
    }

    // Show mobile nav
    function showMobileNav() {
      $('body').addClass('mobilenav-active');
      $('#menu-trigger + label i').attr('aria-label', 'Hide navigation menu');

      // Enable focus of nav items using tabindex
      $('.navbar-menu').each(function() {
        var el = $(this);
        $('a', el).attr('tabindex', '0');
      });
    }

    // Hide mobile nav
    function hideMobileNav() {
      $('body').removeClass('mobilenav-active');
      $('#menu-trigger + label i').attr('aria-label', 'Show navigation menu');

      // Disable focus of nav items using tabindex
      $('.navbar-menu').each(function() {
        var el = $(this);
        $('a', el).attr('tabindex', '-1');
      });
    }

    // Show mobile sidebar-nav
    function showMobileAsideNav() {
      $('body').addClass('mobile-aside-nav-active');

      // Enable focus of nav items using tabindex
      $('.widget_nav_menu').each(function() {
        var el = $(this);
        $('a', el).attr('tabindex', '0');
      });
    }

    // Hide mobile sidebar-nav
    function hideMobileAsideNav() {
      $('body').removeClass('mobile-aside-nav-active');

      // Disable focus of nav items using tabindex
      $('.widget_nav_menu').each(function() {
        var el = $(this);
        $('a', el).attr('tabindex', '-1');
      });
    }

    // Toggle mobile sidebar-nav
    $('.widget_nav_menu').on('click', '#sidebar-nav-trigger', function() {
      if ($('body').hasClass('mobile-aside-nav-active')) {
        hideMobileAsideNav();
      } else {
        showMobileAsideNav();
      }
    });

    // Only show mobile sidebarnav if an element inside is receiving focus
    $('.widget_nav_menu').each(function() {
      var el = $(this);

      $('a', el).on('focus', function() {
        $(this).parents('li').addClass('hover');
      }).on('focusout', function() {
        $(this).parents('li').removeClass('hover');

        if (smDown.matches) {
          setTimeout(function() {
            if ($(':focus').closest('ul.menu').length == 0) {
              hideMobileAsideNav();
            }
          });
        }
      });
    });

    // Only show search if element inside is receiving focus
    $('.a11y-tools .search-form').on('click', 'input', function(e) {
      e.preventDefault();

      // Only allow default action (submit) if the search field has content
      // If not, switch focus to search field instead
      if ($(this).hasClass('search-submit')) {
        if ($('.a11y-tools .search-field').val().length > 0) {
          $('.a11y-tools .search-form').submit();
        } else {
          $('.a11y-tools .search-form .search-field').focus();
        }
      }

      return false;
    }).on('focus', 'input', function() {
      activateSearch();
    }).on('focusout', function() {
      setTimeout(function () {
        if ($(':focus').closest('.a11y-tools').length == 0) {
          deactivateSearch();
        }
      }, 200);
    });

    // Toggle mobile nav
    $('#menu-trigger').on('change focusout', function() {
      if ($(this).prop('checked')) {
        showMobileNav();
      } else {
        hideMobileNav();
      }
    });

    // Only show mobile nav if an element inside is receiving focus
    $('.navbar-menu').each(function () {
      var el = $(this);

      $('a', el).on('focus', function() {
        $(this).parents('li').addClass('hover');
      }).on('focusout', function() {
        $(this).parents('li').removeClass('hover');

        if (smDown.matches) {
          setTimeout(function () {
            if ($(':focus').closest('#menu-primary-menu').length == 0) {
              $('#menu-trigger').prop('checked', false);
              hideMobileNav();
            }
          }, 200);
        }
      });
    });

    // Toggle a11y toolbar
    $('#a11y-tools-trigger').on('change', function() {
      if (smDown.matches) {
        if ($(this).prop('checked')) {
          showA11yToolbar();
        } else {
          hideA11yToolbar();
        }
      }
    });

    // Make a11y toolbar keyboard accessible
    $('.a11y-tools').on('focusout', 'input', function() {
      setTimeout(function () {
        if (smDown.matches) {
          if ($(':focus').closest('.a11y-tools').length == 0) {
            $('#a11y-tools-trigger').prop('checked', false);
            hideA11yToolbar();
          }
        }
      }, 200);
    });

    // Controls for changing text size
    $('#text-size input[name="text-size"]').on('change', function() {
      var tsize = $(this).val();
      $('html').attr('data-text-size', tsize);
      document.cookie = 'data_text_size=' + tsize + ';max-age=31536000;path=/';
    });

    // Controls for changing contrast
    $('#toggle-contrast input[name="contrast"]').on('change', function() {
      var contrast = $(this).is(':checked');
      $('html').attr('data-contrast', contrast);
      document.cookie = 'data_contrast=' + contrast + ';max-age=31536000;path=/';
    });

  },
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 1)))

/***/ }),
/* 22 */
/*!********************************!*\
  !*** ./scripts/routes/home.js ***!
  \********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  init: function init() {
    // JavaScript to be fired on the home page
  },
  finalize: function finalize() {
    // JavaScript to be fired on the home page, after the init JS
  },
});


/***/ }),
/* 23 */
/*!*********************************!*\
  !*** ./scripts/routes/about.js ***!
  \*********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  init: function init() {
    // JavaScript to be fired on the about us page
  },
});


/***/ }),
/* 24 */
/*!**********************************************************************************************************************************!*\
  !*** /Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/node_modules/webfontloader/webfontloader.js ***!
  \**********************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/* Web Font Loader v1.6.28 - (c) Adobe Systems, Google. License: Apache 2.0 */(function(){function aa(a,b,c){return a.call.apply(a.bind,arguments)}function ba(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function p(a,b,c){p=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?aa:ba;return p.apply(null,arguments)}var q=Date.now||function(){return+new Date};function ca(a,b){this.a=a;this.o=b||a;this.c=this.o.document}var da=!!window.FontFace;function t(a,b,c,d){b=a.c.createElement(b);if(c)for(var e in c)c.hasOwnProperty(e)&&("style"==e?b.style.cssText=c[e]:b.setAttribute(e,c[e]));d&&b.appendChild(a.c.createTextNode(d));return b}function u(a,b,c){a=a.c.getElementsByTagName(b)[0];a||(a=document.documentElement);a.insertBefore(c,a.lastChild)}function v(a){a.parentNode&&a.parentNode.removeChild(a)}
function w(a,b,c){b=b||[];c=c||[];for(var d=a.className.split(/\s+/),e=0;e<b.length;e+=1){for(var f=!1,g=0;g<d.length;g+=1)if(b[e]===d[g]){f=!0;break}f||d.push(b[e])}b=[];for(e=0;e<d.length;e+=1){f=!1;for(g=0;g<c.length;g+=1)if(d[e]===c[g]){f=!0;break}f||b.push(d[e])}a.className=b.join(" ").replace(/\s+/g," ").replace(/^\s+|\s+$/,"")}function y(a,b){for(var c=a.className.split(/\s+/),d=0,e=c.length;d<e;d++)if(c[d]==b)return!0;return!1}
function ea(a){return a.o.location.hostname||a.a.location.hostname}function z(a,b,c){function d(){m&&e&&f&&(m(g),m=null)}b=t(a,"link",{rel:"stylesheet",href:b,media:"all"});var e=!1,f=!0,g=null,m=c||null;da?(b.onload=function(){e=!0;d()},b.onerror=function(){e=!0;g=Error("Stylesheet failed to load");d()}):setTimeout(function(){e=!0;d()},0);u(a,"head",b)}
function A(a,b,c,d){var e=a.c.getElementsByTagName("head")[0];if(e){var f=t(a,"script",{src:b}),g=!1;f.onload=f.onreadystatechange=function(){g||this.readyState&&"loaded"!=this.readyState&&"complete"!=this.readyState||(g=!0,c&&c(null),f.onload=f.onreadystatechange=null,"HEAD"==f.parentNode.tagName&&e.removeChild(f))};e.appendChild(f);setTimeout(function(){g||(g=!0,c&&c(Error("Script load timeout")))},d||5E3);return f}return null};function B(){this.a=0;this.c=null}function C(a){a.a++;return function(){a.a--;D(a)}}function E(a,b){a.c=b;D(a)}function D(a){0==a.a&&a.c&&(a.c(),a.c=null)};function F(a){this.a=a||"-"}F.prototype.c=function(a){for(var b=[],c=0;c<arguments.length;c++)b.push(arguments[c].replace(/[\W_]+/g,"").toLowerCase());return b.join(this.a)};function G(a,b){this.c=a;this.f=4;this.a="n";var c=(b||"n4").match(/^([nio])([1-9])$/i);c&&(this.a=c[1],this.f=parseInt(c[2],10))}function fa(a){return H(a)+" "+(a.f+"00")+" 300px "+I(a.c)}function I(a){var b=[];a=a.split(/,\s*/);for(var c=0;c<a.length;c++){var d=a[c].replace(/['"]/g,"");-1!=d.indexOf(" ")||/^\d/.test(d)?b.push("'"+d+"'"):b.push(d)}return b.join(",")}function J(a){return a.a+a.f}function H(a){var b="normal";"o"===a.a?b="oblique":"i"===a.a&&(b="italic");return b}
function ga(a){var b=4,c="n",d=null;a&&((d=a.match(/(normal|oblique|italic)/i))&&d[1]&&(c=d[1].substr(0,1).toLowerCase()),(d=a.match(/([1-9]00|normal|bold)/i))&&d[1]&&(/bold/i.test(d[1])?b=7:/[1-9]00/.test(d[1])&&(b=parseInt(d[1].substr(0,1),10))));return c+b};function ha(a,b){this.c=a;this.f=a.o.document.documentElement;this.h=b;this.a=new F("-");this.j=!1!==b.events;this.g=!1!==b.classes}function ia(a){a.g&&w(a.f,[a.a.c("wf","loading")]);K(a,"loading")}function L(a){if(a.g){var b=y(a.f,a.a.c("wf","active")),c=[],d=[a.a.c("wf","loading")];b||c.push(a.a.c("wf","inactive"));w(a.f,c,d)}K(a,"inactive")}function K(a,b,c){if(a.j&&a.h[b])if(c)a.h[b](c.c,J(c));else a.h[b]()};function ja(){this.c={}}function ka(a,b,c){var d=[],e;for(e in b)if(b.hasOwnProperty(e)){var f=a.c[e];f&&d.push(f(b[e],c))}return d};function M(a,b){this.c=a;this.f=b;this.a=t(this.c,"span",{"aria-hidden":"true"},this.f)}function N(a){u(a.c,"body",a.a)}function O(a){return"display:block;position:absolute;top:-9999px;left:-9999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:"+I(a.c)+";"+("font-style:"+H(a)+";font-weight:"+(a.f+"00")+";")};function P(a,b,c,d,e,f){this.g=a;this.j=b;this.a=d;this.c=c;this.f=e||3E3;this.h=f||void 0}P.prototype.start=function(){var a=this.c.o.document,b=this,c=q(),d=new Promise(function(d,e){function f(){q()-c>=b.f?e():a.fonts.load(fa(b.a),b.h).then(function(a){1<=a.length?d():setTimeout(f,25)},function(){e()})}f()}),e=null,f=new Promise(function(a,d){e=setTimeout(d,b.f)});Promise.race([f,d]).then(function(){e&&(clearTimeout(e),e=null);b.g(b.a)},function(){b.j(b.a)})};function Q(a,b,c,d,e,f,g){this.v=a;this.B=b;this.c=c;this.a=d;this.s=g||"BESbswy";this.f={};this.w=e||3E3;this.u=f||null;this.m=this.j=this.h=this.g=null;this.g=new M(this.c,this.s);this.h=new M(this.c,this.s);this.j=new M(this.c,this.s);this.m=new M(this.c,this.s);a=new G(this.a.c+",serif",J(this.a));a=O(a);this.g.a.style.cssText=a;a=new G(this.a.c+",sans-serif",J(this.a));a=O(a);this.h.a.style.cssText=a;a=new G("serif",J(this.a));a=O(a);this.j.a.style.cssText=a;a=new G("sans-serif",J(this.a));a=
O(a);this.m.a.style.cssText=a;N(this.g);N(this.h);N(this.j);N(this.m)}var R={D:"serif",C:"sans-serif"},S=null;function T(){if(null===S){var a=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent);S=!!a&&(536>parseInt(a[1],10)||536===parseInt(a[1],10)&&11>=parseInt(a[2],10))}return S}Q.prototype.start=function(){this.f.serif=this.j.a.offsetWidth;this.f["sans-serif"]=this.m.a.offsetWidth;this.A=q();U(this)};
function la(a,b,c){for(var d in R)if(R.hasOwnProperty(d)&&b===a.f[R[d]]&&c===a.f[R[d]])return!0;return!1}function U(a){var b=a.g.a.offsetWidth,c=a.h.a.offsetWidth,d;(d=b===a.f.serif&&c===a.f["sans-serif"])||(d=T()&&la(a,b,c));d?q()-a.A>=a.w?T()&&la(a,b,c)&&(null===a.u||a.u.hasOwnProperty(a.a.c))?V(a,a.v):V(a,a.B):ma(a):V(a,a.v)}function ma(a){setTimeout(p(function(){U(this)},a),50)}function V(a,b){setTimeout(p(function(){v(this.g.a);v(this.h.a);v(this.j.a);v(this.m.a);b(this.a)},a),0)};function W(a,b,c){this.c=a;this.a=b;this.f=0;this.m=this.j=!1;this.s=c}var X=null;W.prototype.g=function(a){var b=this.a;b.g&&w(b.f,[b.a.c("wf",a.c,J(a).toString(),"active")],[b.a.c("wf",a.c,J(a).toString(),"loading"),b.a.c("wf",a.c,J(a).toString(),"inactive")]);K(b,"fontactive",a);this.m=!0;na(this)};
W.prototype.h=function(a){var b=this.a;if(b.g){var c=y(b.f,b.a.c("wf",a.c,J(a).toString(),"active")),d=[],e=[b.a.c("wf",a.c,J(a).toString(),"loading")];c||d.push(b.a.c("wf",a.c,J(a).toString(),"inactive"));w(b.f,d,e)}K(b,"fontinactive",a);na(this)};function na(a){0==--a.f&&a.j&&(a.m?(a=a.a,a.g&&w(a.f,[a.a.c("wf","active")],[a.a.c("wf","loading"),a.a.c("wf","inactive")]),K(a,"active")):L(a.a))};function oa(a){this.j=a;this.a=new ja;this.h=0;this.f=this.g=!0}oa.prototype.load=function(a){this.c=new ca(this.j,a.context||this.j);this.g=!1!==a.events;this.f=!1!==a.classes;pa(this,new ha(this.c,a),a)};
function qa(a,b,c,d,e){var f=0==--a.h;(a.f||a.g)&&setTimeout(function(){var a=e||null,m=d||null||{};if(0===c.length&&f)L(b.a);else{b.f+=c.length;f&&(b.j=f);var h,l=[];for(h=0;h<c.length;h++){var k=c[h],n=m[k.c],r=b.a,x=k;r.g&&w(r.f,[r.a.c("wf",x.c,J(x).toString(),"loading")]);K(r,"fontloading",x);r=null;if(null===X)if(window.FontFace){var x=/Gecko.*Firefox\/(\d+)/.exec(window.navigator.userAgent),xa=/OS X.*Version\/10\..*Safari/.exec(window.navigator.userAgent)&&/Apple/.exec(window.navigator.vendor);
X=x?42<parseInt(x[1],10):xa?!1:!0}else X=!1;X?r=new P(p(b.g,b),p(b.h,b),b.c,k,b.s,n):r=new Q(p(b.g,b),p(b.h,b),b.c,k,b.s,a,n);l.push(r)}for(h=0;h<l.length;h++)l[h].start()}},0)}function pa(a,b,c){var d=[],e=c.timeout;ia(b);var d=ka(a.a,c,a.c),f=new W(a.c,b,e);a.h=d.length;b=0;for(c=d.length;b<c;b++)d[b].load(function(b,d,c){qa(a,f,b,d,c)})};function ra(a,b){this.c=a;this.a=b}
ra.prototype.load=function(a){function b(){if(f["__mti_fntLst"+d]){var c=f["__mti_fntLst"+d](),e=[],h;if(c)for(var l=0;l<c.length;l++){var k=c[l].fontfamily;void 0!=c[l].fontStyle&&void 0!=c[l].fontWeight?(h=c[l].fontStyle+c[l].fontWeight,e.push(new G(k,h))):e.push(new G(k))}a(e)}else setTimeout(function(){b()},50)}var c=this,d=c.a.projectId,e=c.a.version;if(d){var f=c.c.o;A(this.c,(c.a.api||"https://fast.fonts.net/jsapi")+"/"+d+".js"+(e?"?v="+e:""),function(e){e?a([]):(f["__MonotypeConfiguration__"+
d]=function(){return c.a},b())}).id="__MonotypeAPIScript__"+d}else a([])};function sa(a,b){this.c=a;this.a=b}sa.prototype.load=function(a){var b,c,d=this.a.urls||[],e=this.a.families||[],f=this.a.testStrings||{},g=new B;b=0;for(c=d.length;b<c;b++)z(this.c,d[b],C(g));var m=[];b=0;for(c=e.length;b<c;b++)if(d=e[b].split(":"),d[1])for(var h=d[1].split(","),l=0;l<h.length;l+=1)m.push(new G(d[0],h[l]));else m.push(new G(d[0]));E(g,function(){a(m,f)})};function ta(a,b){a?this.c=a:this.c=ua;this.a=[];this.f=[];this.g=b||""}var ua="https://fonts.googleapis.com/css";function va(a,b){for(var c=b.length,d=0;d<c;d++){var e=b[d].split(":");3==e.length&&a.f.push(e.pop());var f="";2==e.length&&""!=e[1]&&(f=":");a.a.push(e.join(f))}}
function wa(a){if(0==a.a.length)throw Error("No fonts to load!");if(-1!=a.c.indexOf("kit="))return a.c;for(var b=a.a.length,c=[],d=0;d<b;d++)c.push(a.a[d].replace(/ /g,"+"));b=a.c+"?family="+c.join("%7C");0<a.f.length&&(b+="&subset="+a.f.join(","));0<a.g.length&&(b+="&text="+encodeURIComponent(a.g));return b};function ya(a){this.f=a;this.a=[];this.c={}}
var za={latin:"BESbswy","latin-ext":"\u00e7\u00f6\u00fc\u011f\u015f",cyrillic:"\u0439\u044f\u0416",greek:"\u03b1\u03b2\u03a3",khmer:"\u1780\u1781\u1782",Hanuman:"\u1780\u1781\u1782"},Aa={thin:"1",extralight:"2","extra-light":"2",ultralight:"2","ultra-light":"2",light:"3",regular:"4",book:"4",medium:"5","semi-bold":"6",semibold:"6","demi-bold":"6",demibold:"6",bold:"7","extra-bold":"8",extrabold:"8","ultra-bold":"8",ultrabold:"8",black:"9",heavy:"9",l:"3",r:"4",b:"7"},Ba={i:"i",italic:"i",n:"n",normal:"n"},
Ca=/^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$/;
function Da(a){for(var b=a.f.length,c=0;c<b;c++){var d=a.f[c].split(":"),e=d[0].replace(/\+/g," "),f=["n4"];if(2<=d.length){var g;var m=d[1];g=[];if(m)for(var m=m.split(","),h=m.length,l=0;l<h;l++){var k;k=m[l];if(k.match(/^[\w-]+$/)){var n=Ca.exec(k.toLowerCase());if(null==n)k="";else{k=n[2];k=null==k||""==k?"n":Ba[k];n=n[1];if(null==n||""==n)n="4";else var r=Aa[n],n=r?r:isNaN(n)?"4":n.substr(0,1);k=[k,n].join("")}}else k="";k&&g.push(k)}0<g.length&&(f=g);3==d.length&&(d=d[2],g=[],d=d?d.split(","):
g,0<d.length&&(d=za[d[0]])&&(a.c[e]=d))}a.c[e]||(d=za[e])&&(a.c[e]=d);for(d=0;d<f.length;d+=1)a.a.push(new G(e,f[d]))}};function Ea(a,b){this.c=a;this.a=b}var Fa={Arimo:!0,Cousine:!0,Tinos:!0};Ea.prototype.load=function(a){var b=new B,c=this.c,d=new ta(this.a.api,this.a.text),e=this.a.families;va(d,e);var f=new ya(e);Da(f);z(c,wa(d),C(b));E(b,function(){a(f.a,f.c,Fa)})};function Ga(a,b){this.c=a;this.a=b}Ga.prototype.load=function(a){var b=this.a.id,c=this.c.o;b?A(this.c,(this.a.api||"https://use.typekit.net")+"/"+b+".js",function(b){if(b)a([]);else if(c.Typekit&&c.Typekit.config&&c.Typekit.config.fn){b=c.Typekit.config.fn;for(var e=[],f=0;f<b.length;f+=2)for(var g=b[f],m=b[f+1],h=0;h<m.length;h++)e.push(new G(g,m[h]));try{c.Typekit.load({events:!1,classes:!1,async:!0})}catch(l){}a(e)}},2E3):a([])};function Ha(a,b){this.c=a;this.f=b;this.a=[]}Ha.prototype.load=function(a){var b=this.f.id,c=this.c.o,d=this;b?(c.__webfontfontdeckmodule__||(c.__webfontfontdeckmodule__={}),c.__webfontfontdeckmodule__[b]=function(b,c){for(var g=0,m=c.fonts.length;g<m;++g){var h=c.fonts[g];d.a.push(new G(h.name,ga("font-weight:"+h.weight+";font-style:"+h.style)))}a(d.a)},A(this.c,(this.f.api||"https://f.fontdeck.com/s/css/js/")+ea(this.c)+"/"+b+".js",function(b){b&&a([])})):a([])};var Y=new oa(window);Y.a.c.custom=function(a,b){return new sa(b,a)};Y.a.c.fontdeck=function(a,b){return new Ha(b,a)};Y.a.c.monotype=function(a,b){return new ra(b,a)};Y.a.c.typekit=function(a,b){return new Ga(b,a)};Y.a.c.google=function(a,b){return new Ea(b,a)};var Z={load:p(Y.load,Y)}; true?!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(){return Z}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):"undefined"!==typeof module&&module.exports?module.exports=Z:(window.WebFont=Z,window.WebFontConfig&&Y.load(window.WebFontConfig));}());


/***/ }),
/* 25 */
/*!**************************!*\
  !*** ./styles/main.scss ***!
  \**************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../node_modules/cache-loader/dist/cjs.js!../../../node_modules/css-loader??ref--4-3!../../../node_modules/postcss-loader/lib??ref--4-4!../../../node_modules/resolve-url-loader??ref--4-5!../../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../../node_modules/import-glob!./main.scss */ 16);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ 33)(content, options);

if(content.locals) module.exports = content.locals;

if(true) {
	module.hot.accept(/*! !../../../node_modules/cache-loader/dist/cjs.js!../../../node_modules/css-loader??ref--4-3!../../../node_modules/postcss-loader/lib??ref--4-4!../../../node_modules/resolve-url-loader??ref--4-5!../../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../../node_modules/import-glob!./main.scss */ 16, function() {
		var newContent = __webpack_require__(/*! !../../../node_modules/cache-loader/dist/cjs.js!../../../node_modules/css-loader??ref--4-3!../../../node_modules/postcss-loader/lib??ref--4-4!../../../node_modules/resolve-url-loader??ref--4-5!../../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../../node_modules/import-glob!./main.scss */ 16);

		if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 26 */
/*!********************************************************************************************************************************!*\
  !*** /Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/node_modules/css-loader/lib/url/escape.js ***!
  \********************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = function escape(url) {
    if (typeof url !== 'string') {
        return url
    }
    // If url is already wrapped in quotes, remove them
    if (/^['"].*['"]$/.test(url)) {
        url = url.slice(1, -1);
    }
    // Should url be wrapped?
    // See https://drafts.csswg.org/css-values-3/#urls
    if (/["'() \t\n]/.test(url)) {
        return '"' + url.replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"'
    }

    return url
}


/***/ }),
/* 27 */
/*!******************************************************************************************************************************!*\
  !*** /Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/node_modules/css-loader/lib/css-base.js ***!
  \******************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 28 */
/*!******************************************!*\
  !*** ./images/icon-contrast-inverse.svg ***!
  \******************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNCIgaGVpZ2h0PSIzNCIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxwYXRoIGlkPSJhIiBkPSJNMCAwaDE2djMySDB6Ii8+PC9kZWZzPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PGNpcmNsZSBjeD0iMTciIGN5PSIxNyIgcj0iMTYiIGZpbGw9IiNGRkYiIHN0cm9rZT0iI0ZGRiIgc3Ryb2tlLXdpZHRoPSIyIi8+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcgMSkiPjxtYXNrIGlkPSJiIiBmaWxsPSIjZmZmIj48dXNlIHhsaW5rOmhyZWY9IiNhIi8+PC9tYXNrPjxjaXJjbGUgY3k9IjE2IiByPSIxNiIgZmlsbD0iIzAwMCIgc3Ryb2tlPSIjRkZGIiBzdHJva2Utd2lkdGg9IjIiIG1hc2s9InVybCgjYikiLz48L2c+PC9nPjwvc3ZnPg=="

/***/ }),
/* 29 */
/*!**********************************!*\
  !*** ./images/icon-contrast.svg ***!
  \**********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNCIgaGVpZ2h0PSIzNCIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxwYXRoIGlkPSJhIiBkPSJNMCAwaDE2djMySDB6Ii8+PC9kZWZzPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PGNpcmNsZSBjeD0iMTciIGN5PSIxNyIgcj0iMTYiIGZpbGw9IiMwMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcgMSkiPjxtYXNrIGlkPSJiIiBmaWxsPSIjZmZmIj48dXNlIHhsaW5rOmhyZWY9IiNhIi8+PC9tYXNrPjxjaXJjbGUgY3k9IjE2IiByPSIxNiIgZmlsbD0iI0ZGRiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIiIG1hc2s9InVybCgjYikiLz48L2c+PC9nPjwvc3ZnPg=="

/***/ }),
/* 30 */
/*!*****************************!*\
  !*** ./images/facebook.svg ***!
  \*****************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4IiB2aWV3Qm94PSIwIDAgNjEyIDYxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNjEyIDYxMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnPjxnPgoJPHBhdGggZD0iTTYxMiwzMDZDNjEyLDEzNy4wMDQsNDc0Ljk5NSwwLDMwNiwwQzEzNy4wMDQsMCwwLDEzNy4wMDQsMCwzMDZjMCwxNjguOTk1LDEzNy4wMDQsMzA2LDMwNiwzMDYgICBDNDc0Ljk5NSw2MTIsNjEyLDQ3NC45OTUsNjEyLDMwNnogTTIyMy44MjUsMzA2di01OC41NTdoMzUuODg1VjIxMi4wM2MwLTQ3Ljc2NCwxNC4yNzEtODIuMTc1LDY2LjU2OS04Mi4xNzVoNjIuMjAxdjU4LjQxOCAgIGgtNDMuNzg1Yy0yMS45NDksMC0yNi45MjksMTQuNTc3LTI2LjkyOSwyOS44NDl2MjkuMzJoNjcuNDg3TDM3Ni4wNDYsMzA2aC01OC4yNzh2MTc2LjYxN0gyNTkuNzFWMzA2SDIyMy44MjV6IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBjbGFzcz0iYWN0aXZlLXBhdGgiIGRhdGEtb2xkX2NvbG9yPSIjRkJGQUZBIiBmaWxsPSIjRkJGQkZCIi8+CjwvZz48L2c+IDwvc3ZnPgo="

/***/ }),
/* 31 */
/*!******************************!*\
  !*** ./images/instagram.svg ***!
  \******************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ2OC43OTIgNDY4Ljc5MiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDY4Ljc5MiA0NjguNzkyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4IiBjbGFzcz0iIj48Zz48Zz4KCTxnPgoJCTxnPgoJCQk8cGF0aCBkPSJNMjM0LjM5NiwwQzEwNC45NDYsMCwwLDEwNC45NDYsMCwyMzQuMzk2czEwNC45NDYsMjM0LjM5NiwyMzQuMzk2LDIzNC4zOTYgICAgIHMyMzQuMzk2LTEwNC45NDYsMjM0LjM5Ni0yMzQuMzk2QzQ2OC43OTIsMTA0LjkxNCwzNjMuODQ2LDAsMjM0LjM5NiwweiBNMzgwLjg4MSwzNzAuMzI5YzAsNS44MTYtNC43MzYsMTAuNTUyLTEwLjYxNSwxMC41NTIgICAgIEg5OC40NjJjLTUuODE2LDAtMTAuNTg0LTQuNzA0LTEwLjU4NC0xMC41NTJWOTguNDYyYzAtNS44MTYsNC43MzYtMTAuNTg0LDEwLjU4NC0xMC41ODRoMjcxLjgwNCAgICAgYzUuODQ4LDAsMTAuNjE1LDQuNzM2LDEwLjYxNSwxMC41ODRDMzgwLjg4MSw5OC40NjIsMzgwLjg4MSwzNzAuMzI5LDM4MC44ODEsMzcwLjMyOXogTTE3NS43ODksMjM0LjM5NiAgICAgYzAtMzIuMzU1LDI2LjI1Mi01OC42MDcsNTguNjA3LTU4LjYwN3M1OC42MDcsMjYuMjUyLDU4LjYwNyw1OC42MDdzLTI2LjI1Miw1OC42MDctNTguNjA3LDU4LjYwNyAgICAgUzE3NS43ODksMjY2Ljc1LDE3NS43ODksMjM0LjM5NnogTTI5My4wMDMsMTE3LjE4Mmg1OC42MDd2NTguNjA3aC01OC42MDdWMTE3LjE4MnogTTMxOS42MzYsMjE5Ljc0NGgzMS45NzN2MTMxLjgzNEgxMTcuMjE0ICAgICBWMjE5Ljc0NGgzMi4wMDVjLTEuMjQsNS44OC0xLjk3MSw4LjQyMi0xLjk3MSwxNC42NTJjMCw0OC4xMTksMzkuMTI0LDg3LjE3OSw4Ny4xNzksODcuMTc5ICAgICBjNDguMTE5LDAsODcuMTc5LTM5LjA2MSw4Ny4xNzktODcuMTc5QzMyMS41NzUsMjI4LjE2NiwzMjAuODc2LDIyNS42MjQsMzE5LjYzNiwyMTkuNzQ0eiIgZGF0YS1vcmlnaW5hbD0iIzA5MDUwOSIgY2xhc3M9ImFjdGl2ZS1wYXRoIiBkYXRhLW9sZF9jb2xvcj0iI0Y4RjVGOCIgZmlsbD0iI0ZERkFGRCIvPgoJCTwvZz4KCTwvZz4KPC9nPjwvZz4gPC9zdmc+Cg=="

/***/ }),
/* 32 */
/*!****************************!*\
  !*** ./images/twitter.svg ***!
  \****************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4IiB2aWV3Qm94PSIwIDAgNjEyIDYxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNjEyIDYxMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnPjxnPgoJPHBhdGggZD0iTTYxMiwzMDZDNjEyLDEzNy4wMDQsNDc0Ljk5NSwwLDMwNiwwQzEzNy4wMDQsMCwwLDEzNy4wMDQsMCwzMDZjMCwxNjguOTk1LDEzNy4wMDQsMzA2LDMwNiwzMDYgICBDNDc0Ljk5NSw2MTIsNjEyLDQ3NC45OTUsNjEyLDMwNnogTTE0MS4yMzMsNDE0Ljc0MWM1LjI4NiwwLjY2OCwxMC42ODIsMS4wMjksMTYuMTM1LDEuMDI5ICAgYzMxLjY4NSwwLjA1Niw2MC44MzgtMTEuMzc4LDgzLjk1NS0zMC41NzJjLTI5LjU5OS0wLjY5NS01NC41NTEtMjEuNjE0LTYzLjE0Ny01MC4zMjNjNC4xMTcsMC44NjIsOC4zNzQsMS4zNjMsMTIuNzEzLDEuMzkyICAgYzYuMTc2LDAuMDI3LDEyLjEyOS0wLjgwOCwxNy44MDQtMi40MjFjLTMwLjkzNC02Ljg0My01NC4yNDUtMzYuMTkxLTU0LjI0NS03MS4xNTljMC0wLjMwNiwwLTAuNjEyLDAtMC45MTggICBjOS4xMjQsNS41MDgsMTkuNTI4LDguODQ2LDMwLjYyNyw5LjM0N2MtMTguMTA5LTEzLjEwMy0zMC4wNDMtMzUuMzU3LTMwLjA0My02MC4zOTRjMC0xMy4yNDEsMy4zMzgtMjUuNTkzLDkuMTUyLTM2LjE2NCAgIGMzMy4zNTQsNDQuMDkyLDgzLjE3Niw3My4zNTYsMTM5LjM0MSw3N2MtMS4xNjgtNS4yNTctMS43NTMtMTAuNzM4LTEuNzUzLTE2LjMyOWMwLTM5LjUzLDMwLjI2Ny03MS4wNzUsNjcuNTk5LTcwLjQ2MyAgIGMxOS40NDQsMC4zMzQsMzcuMDI1LDkuMjYzLDQ5LjM1LDIzLjI4NGMxNS40MTEtMi45NDksMjkuODc2LTguNjI0LDQyLjkyMy0xNi41NTJjLTUuMDM1LDE2LjQ5Ni0xNS43NzIsMzAuMjM4LTI5LjczNywzOC44MzQgICBjMTMuNjg3LTEuNTMsMjYuNzA1LTUuMTQ2LDM4LjgzNC0xMC42MjZjLTkuMDY4LDE0LjEwNC0yMC41MywyNi40MjctMzMuNzQzLDM2LjI3NWMwLjEzOSwzLjA2LDAuMTk0LDYuMTIsMC4xOTQsOS4xOCAgIGMwLDkzLjg1OS02OC4wMTYsMjAyLjA5OS0xOTIuMzYzLDIwMi4wNDNDMjA2LjY4OSw0NDcuMjMyLDE3MS4xMzgsNDM1LjI3MSwxNDEuMjMzLDQxNC43NDF6IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBjbGFzcz0iYWN0aXZlLXBhdGgiIGRhdGEtb2xkX2NvbG9yPSIjRjZGNUY1IiBmaWxsPSIjRjZGNkY2Ii8+CjwvZz48L2c+IDwvc3ZnPgo="

/***/ }),
/* 33 */
/*!*********************************************************************************************************************************!*\
  !*** /Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/node_modules/style-loader/lib/addStyles.js ***!
  \*********************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ 34);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 34 */
/*!****************************************************************************************************************************!*\
  !*** /Users/lexinamer/Desktop/Unity/Github/adanc/app/public/wp-content/themes/adanc/node_modules/style-loader/lib/urls.js ***!
  \****************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map