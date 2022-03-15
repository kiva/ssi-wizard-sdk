import createEndpoints from '../src/utils/createEndpoints';

describe('The createEndpoints utility', () => {
    const defaultOpts: any = {
        port: 9907,
        i: 'excelsior'
    }

    it('passes an array through unchanged', () => {
        const testArray = ['X', 'Y', 'Z'];
        defaultOpts.endpoints = testArray;
        expect(createEndpoints(defaultOpts)).toEqual(testArray);
    });

    it('creates an array from comma-separated values', () => {
        defaultOpts.endpoints = ['X,Y,Z'];
        expect(createEndpoints(defaultOpts)).toEqual(['X', 'Y', 'Z']);
    });

    it('separates values of an array where some values are comma-separated', () => {
        defaultOpts.endpoints = ['X,Y,Z', 'A', 'B', 'C,D'];
        expect(createEndpoints(defaultOpts)).toEqual(['X', 'Y', 'Z', 'A', 'B', 'C', 'D']);
    });
});
