const plugin = require('../lib/index');
const { name, devDependencies } = require('../package.json');

describe('gasket-plugin-typescript', () => {

  describe('plugin', () => {
    it('should be an object', () => {
      expect(plugin).toBeInstanceOf(Object);
    });

    it('should have a name', () => {
      expect(plugin).toHaveProperty('name');
      expect(plugin.name).toEqual(name);
    });

    it('should have hooks', () => {
      expect(plugin).toHaveProperty('hooks');
      expect(plugin.hooks).toBeInstanceOf(Object);
    });

    it('should have expected hooks', () => {
      const expected = [
        'create'
      ];
      expect(Object.keys(plugin.hooks)).toEqual(expect.arrayContaining(expected));
    });

    it('should have hooks that are functions', () => {
      Object.keys(plugin.hooks).forEach(hook => {
        expect(plugin.hooks[hook]).toBeInstanceOf(Function);
      });
    });
  });

  describe('create hook', () => {
    let mockContext;

    beforeEach(() => {
      mockContext = {
        pkg: {
          add: jest.fn()
        },
        files: {
          add: jest.fn()
        }
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('adds devDependencies to package.json', () => {
      plugin.hooks.create({}, mockContext);
      expect(mockContext.pkg.add).toHaveBeenCalledWith('devDependencies', {
        'nodemon': devDependencies.nodemon,
        'ts-node': devDependencies['ts-node'],
        'typescript': devDependencies.typescript
      });
    });

    it('adds scripts to package.json', () => {
      plugin.hooks.create({}, mockContext);
      expect(mockContext.pkg.add).toHaveBeenCalledWith('scripts', {
        build: 'tsc',
        start: 'node dist/server.js',
        local: 'nodemon server.ts'
      });
    });

    it('adds files', () => {
      plugin.hooks.create({}, mockContext);
      expect(mockContext.files.add).toHaveBeenCalledWith(
        expect.stringMatching(/generator\/\*/)
      );
    });
  });
});