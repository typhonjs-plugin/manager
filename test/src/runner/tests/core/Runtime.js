export default class Runtime
{
   static run(Module, data, chai)
   {
      const { assert, expect } = chai;

      const PluginManager = Module.default;
      const { Eventbus, EventbusProxy } = Module;

      describe(`Core Runtime (${data.suitePrefix}):`, () =>
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

         describe('Various methods:', () =>
         {
            let eventbus, pluginManager;

            beforeEach(() =>
            {
               pluginManager = new PluginManager({
                  manager: {
                     noEventAdd: false,
                     noEventDestroy: false,
                     noEventRemoval: false,
                     noEventSetEnabled: false,
                     noEventSetOptions: false
                  }
               });

               eventbus = pluginManager.createEventbusProxy();
            });

            it('destroy', async () =>
            {
               const eventbusSecure = pluginManager.createEventbusSecure('secure');

               assert.strictEqual(eventbusSecure.name, 'secure');

               await eventbus.triggerAsync('plugins:async:add',
                { name: 'PluginTestSync', instance: new data.plugins.PluginTestSync() });

               const results = await eventbus.triggerAsync('plugins:async:destroy:manager');

               assert.isArray(results);
               assert.strictEqual(results.length, 1);
               assert.strictEqual(results[0].plugin, 'PluginTestSync');
               assert.strictEqual(results[0].success, true);

               assert.isTrue(eventbusSecure.isDestroyed);
            });

            it('getEnabled', async () =>
            {
               await eventbus.triggerAsync('plugins:async:add',
                { name: 'PluginTestSync', instance: new data.plugins.PluginTestSync() });

               let results = eventbus.triggerSync('plugins:get:enabled', { plugins: 'PluginTestSync' });
               assert.isBoolean(results);
               assert.isTrue(results);

               results = eventbus.triggerSync('plugins:get:enabled', { plugins: ['PluginTestSync'] });

               assert.isArray(results);
               assert.strictEqual(results.length, 1);
               assert.strictEqual(results[0].plugin, 'PluginTestSync');
               assert.strictEqual(results[0].enabled, true);

               results = eventbus.triggerSync('plugins:get:enabled');

               assert.isArray(results);
               assert.strictEqual(results.length, 1);
               assert.strictEqual(results[0].plugin, 'PluginTestSync');
               assert.strictEqual(results[0].enabled, true);
            });

            it('get all plugin data', async () =>
            {
               await eventbus.triggerAsync('plugins:async:add:all', [
                  { name: 'PluginTestSync', instance: new data.plugins.PluginTestSync() },
                  { name: 'PluginTestNoName2', instance: new data.plugins.PluginTestNoName2() }
               ], { name: 'modulename' });

               let results = pluginManager.getPluginData();

               assert.isArray(results);
               assert.strictEqual(JSON.stringify(results),
                '[{"manager":{"eventPrepend":"plugins","scopedName":"plugins:PluginTestSync"},"module":{"name":"modulename"},"plugin":{"name":"PluginTestSync","target":"PluginTestSync","targetEscaped":"PluginTestSync","type":"instance","options":{}}},{"manager":{"eventPrepend":"plugins","scopedName":"plugins:PluginTestNoName2"},"module":{"name":"modulename"},"plugin":{"name":"PluginTestNoName2","target":"PluginTestNoName2","targetEscaped":"PluginTestNoName2","type":"instance","options":{}}}]');

               results = eventbus.triggerSync('plugins:get:plugin:data');

               assert.isArray(results);
               assert.strictEqual(JSON.stringify(results),
                '[{"manager":{"eventPrepend":"plugins","scopedName":"plugins:PluginTestSync"},"module":{"name":"modulename"},"plugin":{"name":"PluginTestSync","target":"PluginTestSync","targetEscaped":"PluginTestSync","type":"instance","options":{}}},{"manager":{"eventPrepend":"plugins","scopedName":"plugins:PluginTestNoName2"},"module":{"name":"modulename"},"plugin":{"name":"PluginTestNoName2","target":"PluginTestNoName2","targetEscaped":"PluginTestNoName2","type":"instance","options":{}}}]');
            });

            it('get plugin data', async () =>
            {
               await eventbus.triggerAsync('plugins:async:add',
                { name: 'PluginTestSync', instance: new data.plugins.PluginTestSync() }, { name: 'modulename' });

               let results = pluginManager.getPluginData({ plugins: 'PluginTestSync' });

               assert.isObject(results);
               assert.strictEqual(JSON.stringify(results),
                '{"manager":{"eventPrepend":"plugins","scopedName":"plugins:PluginTestSync"},"module":{"name":"modulename"},"plugin":{"name":"PluginTestSync","target":"PluginTestSync","targetEscaped":"PluginTestSync","type":"instance","options":{}}}');

               results = eventbus.triggerSync('plugins:get:plugin:data', { plugins: ['PluginTestSync'] });

               assert.isArray(results);
               assert.strictEqual(results.length, 1);
               assert.strictEqual(JSON.stringify(results[0]),
                '{"manager":{"eventPrepend":"plugins","scopedName":"plugins:PluginTestSync"},"module":{"name":"modulename"},"plugin":{"name":"PluginTestSync","target":"PluginTestSync","targetEscaped":"PluginTestSync","type":"instance","options":{}}}');

               results = eventbus.triggerSync('plugins:get:plugin:data', { plugins: 'Bad Name' });
               assert.isUndefined(results);
            });

            it('get plugin event names', async () =>
            {
               await pluginManager.add({ name: 'PluginTest', instance: new data.plugins.PluginTest() });

               await pluginManager.add(
                { name: 'objectPluginTest', target: './test/fixture/plugins/objectPluginTest.js' });

               let results = eventbus.triggerSync('plugins:get:plugin:events');

               assert.strictEqual(JSON.stringify(results),
                '[{"plugin":"PluginTest","events":["test:trigger","test:trigger2","test:trigger3"]},{"plugin":"objectPluginTest","events":["test:trigger","test:trigger4","test:trigger5"]}]');

               results = eventbus.triggerSync('plugins:get:plugin:events', { plugins: 'PluginTest' });

               assert.strictEqual(JSON.stringify(results),
                '["test:trigger","test:trigger2","test:trigger3"]');

               results = eventbus.triggerSync('plugins:get:plugin:events', { plugins: 'objectPluginTest' });

               assert.strictEqual(JSON.stringify(results),
                '["test:trigger","test:trigger4","test:trigger5"]');

               results = eventbus.triggerSync('plugins:get:plugin:events', { plugins: ['PluginTest'] });

               assert.strictEqual(JSON.stringify(results),
                '[{"plugin":"PluginTest","events":["test:trigger","test:trigger2","test:trigger3"]}]');
            });

            it('get plugin name from event name & regex', async () =>
            {
               await pluginManager.add({ name: 'PluginTest', instance: new data.plugins.PluginTest() });

               await pluginManager.add(
                { name: 'objectPluginTest', target: './test/fixture/plugins/objectPluginTest.js' });

               let results = eventbus.triggerSync('plugins:get:plugin:by:event', { event: 'test:trigger' });

               assert.strictEqual(JSON.stringify(results), '["PluginTest","objectPluginTest"]');

               results = eventbus.triggerSync('plugins:get:plugin:by:event', { event: 'test:trigger2' });

               assert.strictEqual(JSON.stringify(results), '["PluginTest"]');

               results = eventbus.triggerSync('plugins:get:plugin:by:event', { event: 'test:trigger4' });

               assert.strictEqual(JSON.stringify(results), '["objectPluginTest"]');

               // By regex
               results = eventbus.triggerSync('plugins:get:plugin:by:event', { event: /test:trigger/ });

               assert.strictEqual(JSON.stringify(results), '["PluginTest","objectPluginTest"]');
            });

            it('getPluginNames', async () =>
            {
               await pluginManager.add({ name: 'PluginTestSync', instance: new data.plugins.PluginTestSync() });
               await pluginManager.add({ name: 'PluginTestSync2', instance: new data.plugins.PluginTestSync() });

               const results = eventbus.triggerSync('plugins:get:plugin:names');

               assert.isArray(results);
               assert.lengthOf(results, 2);
               assert.strictEqual(results[0], 'PluginTestSync');
               assert.strictEqual(results[1], 'PluginTestSync2');
            });

            it('getPluginNames - enabled false', async () =>
            {
               await pluginManager.add({ name: 'PluginTestSync', instance: new data.plugins.PluginTestSync() });
               await pluginManager.add({ name: 'PluginTestSync2', instance: new data.plugins.PluginTestSync() });

               pluginManager.setEnabled({ enabled: false, plugins: 'PluginTestSync2' });

               const results = eventbus.triggerSync('plugins:get:plugin:names', { enabled: false });

               assert.isArray(results);
               assert.lengthOf(results, 1);
               assert.strictEqual(results[0], 'PluginTestSync2');
            });

            it('hasPlugins', async () =>
            {
               await pluginManager.add({ name: 'PluginTestSync', instance: new data.plugins.PluginTestSync() });
               await pluginManager.add({ name: 'PluginTestSync2', instance: new data.plugins.PluginTestSync() });

               let results = eventbus.triggerSync('plugins:has:plugin', { plugins: 'PluginTestSync2' });

               assert.isBoolean(results);
               assert.isTrue(results);

               results = eventbus.triggerSync('plugins:has:plugin', { plugins: ['PluginTestSync', 'Bad Name'] });

               assert.isBoolean(results);
               assert.isFalse(results);

               results = eventbus.triggerSync('plugins:has:plugin');

               assert.isBoolean(results);
               assert.isTrue(results);
            });

            it('setEnabled (false / true) - event bindings release / register', async () =>
            {
               eventbus.trigger('plugins:set:options', { noEventSetEnabled: false });

               await pluginManager.add({ name: 'PluginTestAsync', instance: new data.plugins.PluginTestAsync() });
               await pluginManager.add({ name: 'PluginTestSync', instance: new data.plugins.PluginTestSync() });

               eventbus.on('typhonjs:plugin:manager:plugin:enabled', (data) => { JSON.stringify(data); });

               eventbus.trigger('plugins:set:enabled', { enabled: false });

               let result = await eventbus.triggerAsync('plugin:test:async:test');
               assert.isUndefined(result);

               result = eventbus.triggerSync('plugin:test:sync:test');
               assert.isUndefined(result);

               eventbus.triggerSync('plugins:set:enabled', { enabled: true });

               result = await eventbus.triggerAsync('plugin:test:async:test', 1, 2);
               assert.strictEqual(result, 6);

               result = eventbus.triggerSync('plugin:test:sync:test', 1, 2);
               assert.strictEqual(result, 6);
            });

            it('setEventbus - early out as same eventbus', async () =>
            {
               const eventbus = pluginManager.getEventbus();
               await pluginManager.setEventbus({ eventbus });
            });

            it('setEventbus - EventbusSecure updates', async () =>
            {
               const eventbus2 = new Eventbus('eventbus2');
               const eventbusSecure = pluginManager.createEventbusSecure();

               await pluginManager.add({ name: 'PluginTestSync', instance: new data.plugins.PluginTestSync() });
               await pluginManager.add({ name: 'PluginTestSync2', instance: new data.plugins.PluginTestSync() });

               let results = eventbusSecure.triggerSync('plugins:get:plugin:names');

               assert.isArray(results);
               assert.lengthOf(results, 2);
               assert.strictEqual(results[0], 'PluginTestSync');
               assert.strictEqual(results[1], 'PluginTestSync2');

               results = eventbusSecure.triggerSync('plugin:test:sync:test', 1, 2);
               assert.isArray(results);
               assert.lengthOf(results, 2);
               assert.strictEqual(results[0], 6);
               assert.strictEqual(results[1], 6);

               await pluginManager.setEventbus({ eventbus: eventbus2, eventPrepend: 'plugins2' });

               assert.strictEqual(eventbusSecure.name, 'eventbus2');

               results = eventbusSecure.triggerSync('plugins2:get:plugin:names');

               assert.isArray(results);
               assert.lengthOf(results, 2);
               assert.strictEqual(results[0], 'PluginTestSync');
               assert.strictEqual(results[1], 'PluginTestSync2');

               results = eventbusSecure.triggerSync('plugin:test:sync:test', 1, 2);

               assert.isArray(results);
               assert.lengthOf(results, 2);
               assert.strictEqual(results[0], 6);
               assert.strictEqual(results[1], 6);
            });
         });

         describe('No event removal all turned on:', () =>
         {
            let eventbus, pluginManager;

            beforeEach(() =>
            {
               pluginManager = new PluginManager({
                  manager: {
                     noEventAdd: true,
                     noEventDestroy: true,
                     noEventRemoval: true,
                     noEventSetEnabled: true,
                     noEventSetOptions: true
                  }
               });

               eventbus = pluginManager.getEventbus();
            });

            it('plugins:async:add', async () =>
            {
               const result = await eventbus.triggerAsync('plugins:async:add', { data: 'bad data / will not add' });
               assert.isUndefined(result);
            });

            it('plugins:async:add:all', async () =>
            {
               const result = await eventbus.triggerAsync('plugins:async:add:all', { data: 'bad data / will not add' });
               assert.isArray(result);
               assert.strictEqual(result.length, 0);
            });

            it('plugins:async:destroy:manager', async () =>
            {
               const result = await eventbus.triggerAsync('plugins:async:destroy:manager');
               assert.isArray(result);
               assert.strictEqual(result.length, 0);

               assert.isFalse(pluginManager.isDestroyed);
            });

            it('plugins:async:remove', async () =>
            {
               const result = await eventbus.triggerAsync('plugins:async:remove',
                { data: 'bad data / will not remove' });

               assert.isArray(result);
               assert.strictEqual(result.length, 0);
            });

            it('plugins:async:remove:all', async () =>
            {
               const result = await eventbus.triggerAsync('plugins:async:remove:all',
                { data: 'bad data / will not remove' });

               assert.isArray(result);
               assert.strictEqual(result.length, 0);
            });

            it('plugins:set:enabled', async () =>
            {
               eventbus.trigger('plugins:set:enabled', { data: 'bad data / will not enable' });
            });

            it('plugins:set:options', async () =>
            {
               eventbus.trigger('plugins:set:options', false);
            });
         });

         describe('Multiple Invocations / Sequences:', () =>
         {
            let pluginManager;

            beforeEach(() =>
            {
               pluginManager = new PluginManager({ manager: { noEventRemoval: false } });
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

            it('error - add / remove - onPluginUnload', async () =>
            {
               await pluginManager.add({
                  name: 'PluginTest',
                  instance: { onPluginUnload: () => { throw new Error('!Error'); } }
               });

               const rData = await pluginManager.remove({ plugins: 'PluginTest' });

               assert.isArray(rData);
               assert.strictEqual(rData.length, 1);
               assert.strictEqual(rData[0].plugin, 'PluginTest');
               assert.strictEqual(rData[0].success, false);
               assert.strictEqual(rData[0].errors[0].message, '!Error');
            });

            it('error - add / remove - event - onPluginUnload & typhonjs:plugin:manager:plugin:removed', async () =>
            {
               const eventbus = pluginManager.getEventbus();

               eventbus.on('typhonjs:plugin:manager:plugin:removed', () => { throw new Error('!!Error'); });

               await pluginManager.add({
                  name: 'PluginTest',
                  instance: { onPluginUnload: () => { throw new Error('!Error'); } }
               });

               const rData = await pluginManager.remove({ plugins: 'PluginTest' });

               assert.isArray(rData);
               assert.strictEqual(rData.length, 1);
               assert.strictEqual(rData[0].plugin, 'PluginTest');
               assert.strictEqual(rData[0].success, false);
               assert.strictEqual(rData[0].errors[0].message, '!Error');
               assert.strictEqual(rData[0].errors[1].message, '!!Error');
            });

            it('module loader add / remove multiple', async () =>
            {
               const eventbus = pluginManager.getEventbus();

               for (const entry of data.pluginFormats)
               {
                  const pData = await pluginManager.add(entry);
                  assert.strictEqual(pData.plugin.type, entry.type);
               }

               for (const entry of data.pluginFormats)
               {
                  const rData = await eventbus.triggerAsync('plugins:async:remove', { plugins: entry.name });
                  assert.isArray(rData);
                  assert.strictEqual(rData.length, 1);
                  assert.strictEqual(rData[0].plugin, entry.name);
                  assert.strictEqual(rData[0].success, true);
               }
            });

            it('module loader addAll / removeAll', async () =>
            {
               const eventbus = pluginManager.getEventbus();

               const pData = await pluginManager.addAll(data.pluginFormats);

               assert.isArray(pData);
               assert.strictEqual(pData.length, data.pluginFormats.length);

               for (let cntr = 0; cntr < pData.length; cntr++)
               {
                  assert.strictEqual(pData[cntr].plugin.name, data.pluginFormats[cntr].name);
                  assert.strictEqual(pData[cntr].plugin.type, data.pluginFormats[cntr].type);
               }

               const rData = await eventbus.triggerAsync('plugins:async:remove:all');

               assert.isArray(rData);
               assert.strictEqual(rData.length, pData.length);

               for (const entry of rData)
               {
                  assert.strictEqual(entry.success, true);
               }
            });
         });
      });
   }
}
