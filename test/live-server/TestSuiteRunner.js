class APIErrors
{
   static run(Module, data, chai)
   {
      const { expect } = chai;

      const PluginManager = Module.default;

      describe('API Errors:', () =>
      {
         describe(`${data.suitePrefix}:`, () =>
         {
            let pluginManager;

            beforeEach(() =>
            {
               pluginManager = new PluginManager();
            });

            it('constructor - throws w/ options not an object', async () =>
            {
               expect(() => new PluginManager(false)).to.throw(TypeError, `'options' is not an object.`);
            });

            it('add - throws w/ no pluginConfig', async () =>
            {
               await expect(pluginManager.add()).to.be.rejectedWith(TypeError, `'pluginConfig' is not an object.`);

               const pluginConfig = { name: false };
               await expect(pluginManager.add(pluginConfig)).to.be.rejectedWith(TypeError,
                `'pluginConfig.name' is not a string for entry: ${JSON.stringify(pluginConfig)}.`);
            });

            it('add - throws w/ bad pluginConfig (name)', async () =>
            {
               const pluginConfig = { name: false };
               await expect(pluginManager.add(pluginConfig)).to.be.rejectedWith(TypeError,
                `'pluginConfig.name' is not a string for entry: ${JSON.stringify(pluginConfig)}.`);
            });

            it('add - throws w/ bad pluginConfig (target)', async () =>
            {
               const pluginConfig = { name: 'a name', target: false };
               await expect(pluginManager.add(pluginConfig)).to.be.rejectedWith(TypeError,
                `'pluginConfig.target' is not a string or URL for entry: ${JSON.stringify(pluginConfig)}.`);
            });

            it('add - throws w/ bad pluginConfig (options)', async () =>
            {
               const pluginConfig = { name: 'a name', options: false };
               await expect(pluginManager.add(pluginConfig)).to.be.rejectedWith(TypeError,
                `'pluginConfig.options' is not an object for entry: ${JSON.stringify(pluginConfig)}.`);
            });

            it('add - throws w/ bad moduleData', async () =>
            {
               const pluginConfig = { name: 'a name' };
               await expect(pluginManager.add(pluginConfig, false)).to.be.rejectedWith(TypeError,
                `'moduleData' is not an object for entry: ${JSON.stringify(pluginConfig)}.`);
            });

            it('add - already has a plugin with same name', async () =>
            {
               await pluginManager.add({ name: 'NAME', instance: {} });

               await expect(pluginManager.add({ name: 'NAME', instance: {} })).to.be.rejectedWith(Error,
                `A plugin already exists with name: NAME.`);
            });

            it('addAll - pluginConfigs not array', async () =>
            {
               await expect(pluginManager.addAll(false)).to.be.rejectedWith(TypeError,
                `'pluginConfigs' is not an array.`);
            });

            it('createEventbusProxy - throws when _eventbus is not set (artificial)', () =>
            {
               pluginManager._eventbus = null;

               expect(() => pluginManager.createEventbusProxy()).to.throw(ReferenceError,
                `No eventbus assigned to plugin manager.`);
            });

            it('invokeAsyncEvent - throws when called with empty parameters', async () =>
            {
               await expect(pluginManager.invokeAsyncEvent()).to.be.rejectedWith(TypeError,
                `'methodName' is not a string.`);
            });

            it('invokeSyncEvent - throws when called with empty parameters', () =>
            {
               expect(() => pluginManager.invokeSyncEvent()).to.throw(TypeError, `'methodName' is not a string.`);
            });

            it('pluginManager destroyed - all methods throw', async () =>
            {
               await pluginManager.destroy();

               await expect(pluginManager.add()).to.be.rejectedWith(ReferenceError,
                'This PluginManager instance has been destroyed.');

               await expect(pluginManager.addAll()).to.be.rejectedWith(ReferenceError,
                'This PluginManager instance has been destroyed.');

               await expect(pluginManager.destroy()).to.be.rejectedWith(ReferenceError,
                'This PluginManager instance has been destroyed.');
            });
         });
      });
   }
}

const s_ALL_EVENTS = [
   'plugins:get:plugin:event:names',
   'plugins:get:plugins:event:names',

   'plugins:get:all:plugin:data',
   'plugins:get:plugin:data',

   'plugins:get:method:names',
   'plugins:get:plugin:method:names',
   'plugins:get:plugin:names',
   'plugins:get:plugin:options',
   'plugins:get:plugins:by:event:name',
   'plugins:has:method',
   'plugins:has:plugin:method'
];

/*
TODO: Implement
         assert.throws(() => pluginManager.getPluginsByEventName());
 */

class APIErrorsPluginSupport$1
{
   static run(Module, data, chai)
   {
      const { expect } = chai;

      const PluginManager = Module.default;
      const { PluginSupport } = Module;

      describe('API Errors (PluginSupport):', () =>
      {
         describe('PluginManager destroyed (artificial) - all triggered events throw:', () =>
         {
            let eventbus, pluginManager;

            beforeEach(() =>
            {
               pluginManager = new PluginManager({ PluginSupport });
               eventbus = pluginManager.getEventbus();

               // Artificially destroy the pluginManager -> _pluginMap
               pluginManager._pluginMap = null;
            });

            for (const event of s_ALL_EVENTS)
            {
               it(event, async () =>
               {
                  expect(() => eventbus.triggerSync(event)).to.throw(ReferenceError,
                   'This PluginManager instance has been destroyed.');
               });
            }
         });

         describe('PluginSupport manager reference lost (artificial) - all triggered events throw:', () =>
         {
            let eventbus, pluginManager;

            beforeEach(() =>
            {
               pluginManager = new PluginManager({ PluginSupport });
               eventbus = pluginManager.getEventbus();

               // Artificially destroy the pluginManager
               pluginManager._pluginSupport._pluginManager = null;
            });

            for (const event of s_ALL_EVENTS)
            {
               it(event, async () =>
               {
                  expect(() => eventbus.triggerSync(event)).to.throw(ReferenceError,
                   'This PluginManager instance has been destroyed.');
               });
            }
         });
      });
   }
}

class IsValidConfig
{
   static run(Module, data, chai)
   {
      const { assert } = chai;

      const { isValidConfig } = Module;
      const PluginManager = Module.default;

      describe('PluginConfig checks:', () =>
      {
         describe('isValidConfig:', () =>
         {
            it('is valid', () =>
            {
               assert.isTrue(isValidConfig({ name: 'test' }));
               assert.isTrue(isValidConfig({ name: 'test', target: 'target' }));
               assert.isTrue(isValidConfig({ name: 'test', target: 'target', options: {} }));
               assert.isTrue(isValidConfig({ name: 'test', options: {} }));
               assert.isTrue(isValidConfig({
                  name: 'test',
                  target: data.moduleURL
               }));
            });

            it('is invalid', () =>
            {
               assert.isFalse(isValidConfig());
               assert.isFalse(isValidConfig({}));
               assert.isFalse(isValidConfig({ name: 123 }));
               assert.isFalse(isValidConfig({ target: 'target' }));
               assert.isFalse(isValidConfig({ options: {} }));
               assert.isFalse(isValidConfig({ name: 'test', target: 123 }));
               assert.isFalse(isValidConfig({ name: 'test', target: 'target', options: 123 }));
               assert.isFalse(isValidConfig({ name: 'test', options: 123 }));
            });
         });

         describe(`${data.suitePrefix} -> isValidConfig:`, () =>
         {
            let pluginManager;

            beforeEach(() =>
            {
               pluginManager = new PluginManager();
            });

            it('PluginConfig is valid', () =>
            {
               assert.isTrue(pluginManager.isValidConfig({ name: 'test' }));
               assert.isTrue(pluginManager.isValidConfig({ name: 'test', target: 'target' }));
               assert.isTrue(pluginManager.isValidConfig({ name: 'test', target: 'target', options: {} }));
               assert.isTrue(pluginManager.isValidConfig({ name: 'test', options: {} }));
               assert.isTrue(pluginManager.isValidConfig({
                  name: 'test',
                  target: data.moduleURL
               }));
            });

            it('PluginConfig is invalid', () =>
            {
               assert.isFalse(pluginManager.isValidConfig());
               assert.isFalse(pluginManager.isValidConfig({}));
               assert.isFalse(pluginManager.isValidConfig({ name: 123 }));
               assert.isFalse(pluginManager.isValidConfig({ target: 'target' }));
               assert.isFalse(pluginManager.isValidConfig({ options: {} }));
               assert.isFalse(pluginManager.isValidConfig({ name: 'test', target: 123 }));
               assert.isFalse(pluginManager.isValidConfig({ name: 'test', target: 'target', options: 123 }));
               assert.isFalse(pluginManager.isValidConfig({ name: 'test', options: 123 }));
            });
         });
      });
   }
}

// const s_ALL_EVENTS = [
//    'plugins:get:all:plugin:data',
//    'plugins:get:method:names',
//    'plugins:get:plugin:data',
//    'plugins:get:plugin:event:names',
//    'plugins:get:plugin:method:names',
//    'plugins:get:plugin:names',
//    'plugins:get:plugin:options',
//    'plugins:get:plugins:by:event:name',
//    'plugins:get:plugins:event:names',
//    'plugins:has:method',
//    'plugins:has:plugin:method'
// ];

class APIErrorsPluginSupport
{
   static run(Module, data, chai)
   {
      const { assert } = chai;

      const PluginManager = Module.default;
      const { Eventbus, PluginSupport } = Module;

      describe('PluginSupport:', () =>
      {
         let eventbus, pluginManager;

         beforeEach(() =>
         {
            pluginManager = new PluginManager({ PluginSupport });
            eventbus = pluginManager.getEventbus();
         });

         it('destroy() invoked when plugin manager is destroyed', async () =>
         {
            assert.isAtLeast(eventbus.eventCount, 20);

            await pluginManager.destroy();

            assert.strictEqual(eventbus.eventCount, 0);

            assert.isNull(pluginManager._pluginSupport);
         });

         it('get all plugin data', async () =>
         {
            await pluginManager.addAll(
            [
               { name: 'PluginTestSync', instance: new data.plugins.PluginTestSync() },
               { name: 'PluginTestNoName2', instance: new data.plugins.PluginTestNoName2() }
            ], { name: 'modulename' });

            const results = eventbus.triggerSync('plugins:get:all:plugin:data');

            assert.isArray(results);

            assert.strictEqual(JSON.stringify(results),
             '[{"manager":{"eventPrepend":"plugins"},"module":{"name":"modulename"},"plugin":{"name":"PluginTestSync","scopedName":"plugins:PluginTestSync","target":"PluginTestSync","targetEscaped":"PluginTestSync","type":"instance","options":{}}},{"manager":{"eventPrepend":"plugins"},"module":{"name":"modulename"},"plugin":{"name":"PluginTestNoName2","scopedName":"plugins:PluginTestNoName2","target":"PluginTestNoName2","targetEscaped":"PluginTestNoName2","type":"instance","options":{}}}]');
         });

         it('get unique method names', async () =>
         {
            await pluginManager.add({ name: 'PluginTestSync', instance: new data.plugins.PluginTestSync() });
            await pluginManager.add({ name: 'PluginTestNoName2', instance: new data.plugins.PluginTestNoName2() });

            const results = eventbus.triggerSync('plugins:get:method:names');

            assert.isArray(results);
            assert.lengthOf(results, 2);
            assert.strictEqual(results[0], 'test');
            assert.strictEqual(results[1], 'test2');
         });

         it('get plugin data', async () =>
         {
            await pluginManager.add({ name: 'PluginTestSync', instance: new data.plugins.PluginTestSync() },
             { name: 'modulename' });

            const results = eventbus.triggerSync('plugins:get:plugin:data', 'PluginTestSync');

            assert.isObject(results);

            assert.strictEqual(JSON.stringify(results),
             '{"manager":{"eventPrepend":"plugins"},"module":{"name":"modulename"},"plugin":{"name":"PluginTestSync","scopedName":"plugins:PluginTestSync","target":"PluginTestSync","targetEscaped":"PluginTestSync","type":"instance","options":{}}}');
         });

         it('get plugin event names', async () =>
         {
            await pluginManager.add({ name: 'PluginTest', instance: new data.plugins.PluginTest() });

            await pluginManager.add({ name: 'objectPluginTest', target: './test/fixture/plugins/objectPluginTest.js' });

            let results = eventbus.triggerSync('plugins:get:plugins:event:names');

            assert.strictEqual(JSON.stringify(results),
             '[{"pluginName":"PluginTest","events":["test:trigger","test:trigger2","test:trigger3"]},{"pluginName":"objectPluginTest","events":["test:trigger","test:trigger4","test:trigger5"]}]');

            results = eventbus.triggerSync('plugins:get:plugins:event:names', 'PluginTest');

            assert.strictEqual(JSON.stringify(results),
             '[{"pluginName":"PluginTest","events":["test:trigger","test:trigger2","test:trigger3"]}]');

            results = eventbus.triggerSync('plugins:get:plugins:event:names', 'objectPluginTest');

            assert.strictEqual(JSON.stringify(results),
             '[{"pluginName":"objectPluginTest","events":["test:trigger","test:trigger4","test:trigger5"]}]');
         });

         it('get plugin name from event name', async () =>
         {
            await pluginManager.add({ name: 'PluginTest', instance: new data.plugins.PluginTest() });

            await pluginManager.add({ name: 'objectPluginTest', target: './test/fixture/plugins/objectPluginTest.js' });

            let results = eventbus.triggerSync('plugins:get:plugins:by:event:name', 'test:trigger');

            assert.strictEqual(JSON.stringify(results), '["PluginTest","objectPluginTest"]');

            results = eventbus.triggerSync('plugins:get:plugins:by:event:name', 'test:trigger2');

            assert.strictEqual(JSON.stringify(results), '["PluginTest"]');

            results = eventbus.triggerSync('plugins:get:plugins:by:event:name', 'test:trigger4');

            assert.strictEqual(JSON.stringify(results), '["objectPluginTest"]');
         });

         it('get plugin / method names', async () =>
         {
            await pluginManager.add({ name: 'PluginTestSync', instance: new data.plugins.PluginTestSync() });
            await pluginManager.add({ name: 'PluginTestNoName2', instance: new data.plugins.PluginTestNoName2() });

            const results = eventbus.triggerSync('plugins:get:plugin:method:names');

            assert.isArray(results);
            assert.lengthOf(results, 2);
            assert.strictEqual(results[0].plugin, 'PluginTestSync');
            assert.strictEqual(results[0].method, 'test');
            assert.strictEqual(results[1].plugin, 'PluginTestNoName2');
            assert.strictEqual(results[1].method, 'test2');
         });

         it('get plugin names', async () =>
         {
            await pluginManager.add({ name: 'PluginTestSync', instance: new data.plugins.PluginTestSync() });
            await pluginManager.add({ name: 'PluginTestSync2', instance: new data.plugins.PluginTestSync() });

            const results = eventbus.triggerSync('plugins:get:plugin:names');

            assert.isArray(results);
            assert.lengthOf(results, 2);
            assert.strictEqual(results[0], 'PluginTestSync');
            assert.strictEqual(results[1], 'PluginTestSync2');
         });

         it('setEventbus() unregisters old eventbus / registers on new eventbus', async () =>
         {
            assert.isAtLeast(eventbus.eventCount, 20);

            const newEventbus = new Eventbus('newEventbus');

            await pluginManager.setEventbus({ eventbus: newEventbus });

            assert.strictEqual(eventbus.eventCount, 0);
            assert.isAtLeast(newEventbus.eventCount, 20);

            assert.strictEqual(pluginManager.getEventbus().name, 'newEventbus');
         });
      });
   }
}

class Runtime
{
   static run(Module, data, chai)
   {
      const { assert, expect } = chai;

      const PluginManager = Module.default;
      const { Eventbus, EventbusProxy } = Module;

      describe(`Runtime (${data.suitePrefix}):`, () =>
      {
         describe('Type checks:', () =>
         {
            let pluginManager;

            beforeEach(() =>
            {
               pluginManager = new PluginManager();
            });

            it('constructor function is exported', () =>
            {
               assert.isFunction(PluginManager);
            });

            it('instance is object', () =>
            {
               assert.isObject(pluginManager);
            });

            it('returns EventbusProxy for createEventbusProxy when eventbus is assigned', () =>
            {
               assert.isTrue(pluginManager.createEventbusProxy() instanceof EventbusProxy);
            });
         });

         describe('invoke:', () =>
         {
            let pluginManager;

            beforeEach(() =>
            {
               pluginManager = new PluginManager();
            });

            it('invoke - has invoked with no results', () =>
            {
               let invoked = false;

               pluginManager.add({ name: 'PluginTestSync', instance: { test: () => { invoked = true; } } });

               pluginManager.invoke('test', void 0, 'PluginTestSync');

               assert.strictEqual(invoked, true);
            });
         });

         describe('invokeAsync:', () =>
         {
            let pluginManager;

            beforeEach(() =>
            {
               pluginManager = new PluginManager();
            });

            it('promise - has invoked one result (async)', (done) =>
            {
               pluginManager.add({ name: 'PluginTestAsync', instance: new data.plugins.PluginTestAsync() }).then(() =>
               {
                  pluginManager.invokeAsync('test', [1, 2], 'PluginTestAsync').then((results) =>
                  {
                     assert.isNumber(results);
                     assert.strictEqual(results, 6);
                     done();
                  });
               });
            });

            it('promise - has invoked two results (async)', (done) =>
            {
               pluginManager.addAll([
                  { name: 'PluginTestAsync', instance: new data.plugins.PluginTestAsync() },
                  { name: 'PluginTestAsync2', instance: new data.plugins.PluginTestAsync() }
               ]).then(() =>
               {
                  pluginManager.invokeAsync('test', [1, 2]).then((results) =>
                  {
                     assert.isArray(results);
                     assert.isNumber(results[0]);
                     assert.isNumber(results[1]);
                     assert.strictEqual(results[0], 6);
                     assert.strictEqual(results[1], 6);
                     done();
                  });
               });
            });

            it('async / await - has invoked one result (async)', async () =>
            {
               await pluginManager.add({ name: 'PluginTestAsync', instance: new data.plugins.PluginTestAsync() });

               const results = await pluginManager.invokeAsync('test', [1, 2], 'PluginTestAsync');

               assert.isNumber(results);
               assert.strictEqual(results, 6);
            });

            it('async / await - has invoked two results (async)', async () =>
            {
               await pluginManager.add({ name: 'PluginTestAsync', instance: new data.plugins.PluginTestAsync() });
               await pluginManager.add({ name: 'PluginTestAsync2', instance: new data.plugins.PluginTestAsync() });

               const results = await pluginManager.invokeAsync('test', [1, 2]);

               assert.isArray(results);
               assert.isNumber(results[0]);
               assert.isNumber(results[1]);
               assert.strictEqual(results[0], 6);
               assert.strictEqual(results[1], 6);
            });
         });

         describe('invokeAsyncEvent:', () =>
         {
            let pluginManager, testData;

            beforeEach(() =>
            {
               pluginManager = new PluginManager();
               testData = { result: { count: 0 } };
            });

            it('has empty result', async () =>
            {
               const event = await pluginManager.invokeAsyncEvent('test');

               assert.isObject(event);
               assert.lengthOf(Object.keys(event), 2);
               assert.strictEqual(event.$$plugin_invoke_count, 0);
            });

            it('w/ plugin and missing method has empty event result', async () =>
            {
               // No await necessary as instance used.
               pluginManager.add({ name: 'PluginTest', instance: new data.plugins.PluginTest() });

               const event = await pluginManager.invokeAsyncEvent('nop');

               assert.isObject(event);
               assert.lengthOf(Object.keys(event), 2);
               assert.strictEqual(event.$$plugin_invoke_count, 0);
            });

            it('w/ static plugin and missing method has empty event result', async () =>
            {
               await pluginManager.add(
                { name: 'StaticPluginTest', target: './test/fixture/plugins/StaticPluginTest.js' });

               const event = await pluginManager.invokeAsyncEvent('nop');

               assert.isObject(event);
               assert.lengthOf(Object.keys(event), 2);
               assert.strictEqual(event.$$plugin_invoke_count, 0);
            });

            it('w/ module plugin and missing method has empty event result', async () =>
            {
               await pluginManager.add(
                { name: 'modulePluginTest', target: './test/fixture/plugins/modulePluginTest.js' });

               const event = await pluginManager.invokeAsyncEvent('nop');

               assert.isObject(event);
               assert.lengthOf(Object.keys(event), 2);
               assert.strictEqual(event.$$plugin_invoke_count, 0);
            });

            it('has valid test / class result (pass through)', async () =>
            {
               // No await necessary as instance used.
               pluginManager.add({ name: 'PluginTest', instance: new data.plugins.PluginTest() });

               const event = await pluginManager.invokeAsyncEvent('test', void 0, testData);

               assert.isObject(event);
               assert.strictEqual(event.result.count, 1);
               assert.strictEqual(testData.result.count, 1);
               assert.strictEqual(event.$$plugin_invoke_count, 1);
            });

            it('static plugin has valid test / class result (pass through)', async () =>
            {
               await pluginManager.add(
                { name: 'StaticPluginTest', target: './test/fixture/plugins/StaticPluginTest.js' });

               const event = await pluginManager.invokeAsyncEvent('test', void 0, testData);

               assert.isObject(event);
               assert.strictEqual(event.result.count, 1);
               assert.strictEqual(testData.result.count, 1);
               assert.strictEqual(event.$$plugin_invoke_count, 1);
            });

            it('module plugin has valid test / class result (pass through)', async () =>
            {
               await pluginManager.add(
                { name: 'modulePluginTest', target: './test/fixture/plugins/modulePluginTest.js' });

               const event = await pluginManager.invokeAsyncEvent('test', void 0, testData);

               assert.isObject(event);
               assert.strictEqual(event.result.count, 1);
               assert.strictEqual(testData.result.count, 1);
               assert.strictEqual(event.$$plugin_invoke_count, 1);
            });

            it('has valid test / object result (pass through)', async () =>
            {
               await pluginManager.add(
                { name: 'objectPluginTest', target: './test/fixture/plugins/objectPluginTest.js' });

               const event = await pluginManager.invokeAsyncEvent('test', void 0, testData);

               assert.isObject(event);
               assert.strictEqual(event.result.count, 1);
               assert.strictEqual(testData.result.count, 1);
            });

            it('has invoked both plugins (pass through)', async () =>
            {
               // No await necessary as instance used.
               pluginManager.add({ name: 'PluginTest', instance: new data.plugins.PluginTest() });

               await pluginManager.add(
                { name: 'objectPluginTest', target: './test/fixture/plugins/objectPluginTest.js' });

               const event = await pluginManager.invokeAsyncEvent('test', void 0, testData);

               assert.isObject(event);
               assert.strictEqual(event.result.count, 2);
               assert.strictEqual(testData.result.count, 2);
            });

            it('has valid test / class result (copy)', async () =>
            {
               // No await necessary as instance used.
               pluginManager.add({ name: 'PluginTest', instance: new data.plugins.PluginTest() });

               const event = await pluginManager.invokeAsyncEvent('test', testData);

               assert.isObject(event);
               assert.strictEqual(event.result.count, 1);
               assert.strictEqual(testData.result.count, 0);
               assert.strictEqual(event.$$plugin_invoke_count, 1);
               assert.strictEqual(event.$$plugin_invoke_names[0], 'PluginTest');
            });

            it('has valid test / object result (copy)', async () =>
            {
               await pluginManager.add(
                { name: 'objectPluginTest', target: './test/fixture/plugins/objectPluginTest.js' });

               const event = await pluginManager.invokeAsyncEvent('test', testData);

               assert.isObject(event);
               assert.strictEqual(event.result.count, 1);
               assert.strictEqual(testData.result.count, 0);
            });

            it('has invoked both plugins (copy)', async () =>
            {
               // No await necessary as instance used.
               pluginManager.add({ name: 'PluginTest', instance: new data.plugins.PluginTest() });

               await pluginManager.add(
                { name: 'objectPluginTest', target: './test/fixture/plugins/objectPluginTest.js' });

               const event = await pluginManager.invokeAsyncEvent('test', testData);

               assert.isObject(event);
               assert.strictEqual(event.result.count, 2);
               assert.strictEqual(testData.result.count, 0);
            });

            it('has invoked both plugins (copy)', async () =>
            {
               await pluginManager.add({ name: 'PluginTestAsync', instance: new data.plugins.PluginTestAsync() });
               await pluginManager.add({ name: 'PluginTestAsync2', instance: new data.plugins.PluginTestAsync() });

               const event = await pluginManager.invokeAsyncEvent('test2', testData);

               assert.isObject(event);
               assert.strictEqual(event.result.count, 2);
               assert.strictEqual(testData.result.count, 0);
            });
         });

         describe('invokeSync:', () =>
         {
            let pluginManager;

            beforeEach(() =>
            {
               pluginManager = new PluginManager();
            });

            it('has invoked one result', () =>
            {
               pluginManager.add({ name: 'PluginTestSync', instance: new data.plugins.PluginTestSync() });

               const result = pluginManager.invokeSync('test', [1, 2], 'PluginTestSync');

               assert.isNumber(result);
               assert.strictEqual(result, 6);
            });

            it('has invoked two result', () =>
            {
               pluginManager.add({ name: 'PluginTestSync', instance: new data.plugins.PluginTestSync() });
               pluginManager.add({ name: 'PluginTestSync2', instance: new data.plugins.PluginTestSync() });

               const result = pluginManager.invokeSync('test', [1, 2]);

               assert.isArray(result);
               assert.strictEqual(result[0], 6);
               assert.strictEqual(result[1], 6);
            });
         });

         describe('invokeSyncEvent:', () =>
         {
            let pluginManager, testData;

            beforeEach(() =>
            {
               pluginManager = new PluginManager();
               testData = { result: { count: 0 } };
            });

            it('has empty result', () =>
            {
               const event = pluginManager.invokeSyncEvent('test');

               assert.isObject(event);
               assert.lengthOf(Object.keys(event), 2);
               assert.strictEqual(event.$$plugin_invoke_count, 0);
            });

            it('w/ plugin and missing method has empty event result', () =>
            {
               // No await necessary as instance used.
               pluginManager.add({ name: 'PluginTest', instance: new data.plugins.PluginTest() });

               const event = pluginManager.invokeSyncEvent('nop');

               assert.isObject(event);
               assert.lengthOf(Object.keys(event), 2);
               assert.strictEqual(event.$$plugin_invoke_count, 0);
            });

            it('w/ static plugin and missing method has empty event result', async () =>
            {
               await pluginManager.add(
                { name: 'StaticPluginTest', target: './test/fixture/plugins/StaticPluginTest.js' });

               const event = pluginManager.invokeSyncEvent('nop');

               assert.isObject(event);
               assert.lengthOf(Object.keys(event), 2);
               assert.strictEqual(event.$$plugin_invoke_count, 0);
            });

            it('w/ module plugin and missing method has empty event result', async () =>
            {
               await pluginManager.add(
                { name: 'modulePluginTest', target: './test/fixture/plugins/modulePluginTest.js' });

               const event = pluginManager.invokeSyncEvent('nop');

               assert.isObject(event);
               assert.lengthOf(Object.keys(event), 2);
               assert.strictEqual(event.$$plugin_invoke_count, 0);
            });

            it('instance plugin has valid test / class result (pass through)', () =>
            {
               // No await necessary as instance used.
               pluginManager.add({ name: 'PluginTest', instance: new data.plugins.PluginTest() });

               const event = pluginManager.invokeSyncEvent('test', void 0, testData);

               assert.isObject(event);
               assert.strictEqual(event.result.count, 1);
               assert.strictEqual(testData.result.count, 1);
               assert.strictEqual(event.$$plugin_invoke_count, 1);
            });

            it('static plugin has valid test / class result (pass through)', async () =>
            {
               await pluginManager.add(
                { name: 'StaticPluginTest', target: './test/fixture/plugins/StaticPluginTest.js' });

               const event = pluginManager.invokeSyncEvent('test', void 0, testData);

               assert.isObject(event);
               assert.strictEqual(event.result.count, 1);
               assert.strictEqual(testData.result.count, 1);
               assert.strictEqual(event.$$plugin_invoke_count, 1);
            });

            it('module plugin has valid test / class result (pass through)', async () =>
            {
               await pluginManager.add(
                { name: 'modulePluginTest', target: './test/fixture/plugins/modulePluginTest.js' });

               const event = pluginManager.invokeSyncEvent('test', void 0, testData);

               assert.isObject(event);
               assert.strictEqual(event.result.count, 1);
               assert.strictEqual(testData.result.count, 1);
               assert.strictEqual(event.$$plugin_invoke_count, 1);
            });

            it('has valid test / object result (pass through)', async () =>
            {
               await pluginManager.add(
                { name: 'objectPluginTest', target: './test/fixture/plugins/objectPluginTest.js' });

               const event = pluginManager.invokeSyncEvent('test', void 0, testData);

               assert.isObject(event);
               assert.strictEqual(event.result.count, 1);
               assert.strictEqual(testData.result.count, 1);
            });

            it('has invoked both plugins (pass through)', async () =>
            {
               // No await necessary as instance used.
               pluginManager.add({ name: 'PluginTest', instance: new data.plugins.PluginTest() });

               await pluginManager.add(
                { name: 'objectPluginTest', target: './test/fixture/plugins/objectPluginTest.js' });

               const event = pluginManager.invokeSyncEvent('test', void 0, testData);

               assert.isObject(event);
               assert.strictEqual(event.result.count, 2);
               assert.strictEqual(testData.result.count, 2);
            });

            it('has valid test / class result (copy)', () =>
            {
               // No await necessary as instance used.
               pluginManager.add({ name: 'PluginTest', instance: new data.plugins.PluginTest() });

               const event = pluginManager.invokeSyncEvent('test', testData);

               assert.isObject(event);
               assert.strictEqual(event.result.count, 1);
               assert.strictEqual(testData.result.count, 0);
               assert.strictEqual(event.$$plugin_invoke_count, 1);
               assert.strictEqual(event.$$plugin_invoke_names[0], 'PluginTest');
            });

            it('has valid test / object result (copy)', async () =>
            {
               await pluginManager.add(
                { name: 'objectPluginTest', target: './test/fixture/plugins/objectPluginTest.js' });

               const event = pluginManager.invokeSyncEvent('test', testData);

               assert.isObject(event);
               assert.strictEqual(event.result.count, 1);
               assert.strictEqual(testData.result.count, 0);
            });

            it('has invoked both plugins (copy)', async () =>
            {
               // No await necessary as instance used.
               pluginManager.add({ name: 'PluginTest', instance: new data.plugins.PluginTest() });

               await pluginManager.add(
                { name: 'objectPluginTest', target: './test/fixture/plugins/objectPluginTest.js' });

               const event = pluginManager.invokeSyncEvent('test', testData);

               assert.isObject(event);
               assert.strictEqual(event.result.count, 2);
               assert.strictEqual(testData.result.count, 0);
            });
         });

         describe('Multiple Invocations / Sequences:', () =>
         {
            let pluginManager;

            beforeEach(() =>
            {
               pluginManager = new PluginManager();
            });

            it('EventbusProxy is destroyed when plugin manager destroyed.', async () =>
            {
               const eventbusProxy = pluginManager.createEventbusProxy();

               await pluginManager.destroy();

               expect(() => eventbusProxy.eventCount).to.throw(ReferenceError,
                'This EventbusProxy instance has been destroyed.');
            });

            it('EventbusProxy shows correct proxy event count.', async () =>
            {
               const eventbus = new Eventbus();
               pluginManager = new PluginManager({ eventbus });

               const eventCount = eventbus.eventCount;

               const eventbusProxy = pluginManager.createEventbusProxy();

               eventbusProxy.on('a:test', () => { /***/ });

               assert.strictEqual(eventbus.eventCount, eventCount + 1);
               assert.strictEqual(eventbusProxy.eventCount, eventCount + 1);
               assert.strictEqual(eventbusProxy.proxyEventCount, 1);

               eventbusProxy.off();

               assert.strictEqual(eventbus.eventCount, eventCount);
               assert.strictEqual(eventbusProxy.eventCount, eventCount);
               assert.strictEqual(eventbusProxy.proxyEventCount, 0);

               await pluginManager.destroy();
            });

            it('module loader add multiple', async () =>
            {
               let pData;

               for (const entry of data.pluginFormats)
               {
                  pData = await pluginManager.add(entry);
                  assert.strictEqual(pData.plugin.type, entry.type);
               }
            });

            it('module loader addAll / removeAll', async () =>
            {
               const pData = await pluginManager.addAll(data.pluginFormats);

               assert.isArray(pData);
               assert.strictEqual(pData.length, data.pluginFormats.length);

               for (let cntr = 0; cntr < pData.length; cntr++)
               {
                  assert.strictEqual(pData[cntr].plugin.type, data.pluginFormats[cntr].type);
               }

               const rData = await pluginManager.removeAll();

               assert.isArray(rData);
               assert.strictEqual(rData.length, pData.length);

               for (const entry of rData)
               {
                  assert.strictEqual(entry.result, true);
               }
            });
         });
      });
   }
}

const s_TESTS = [];

{ s_TESTS.push(APIErrors); }
{ s_TESTS.push(APIErrorsPluginSupport$1); }
{ s_TESTS.push(IsValidConfig); }
{ s_TESTS.push(APIErrorsPluginSupport); }
{ s_TESTS.push(Runtime); }

class TestSuiteRunner
{
   static run(PluginManager, config, chai)
   {
      for (const Test of s_TESTS)
      {
         Test.run(PluginManager, config, chai);
      }
   }
}

export default TestSuiteRunner;
