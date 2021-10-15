import {FlowDispatchTypes} from '../src/index';

describe('The FlowDispatchTypes enum', () => {
    it('has a value of "NEXT" for the NEXT key', () => {
        expect(FlowDispatchTypes.NEXT).toBe('NEXT');
    });

    it('has a value of "BACK" for the BACK key', () => {
        expect(FlowDispatchTypes.BACK).toBe('BACK');
    });

    it('has a value of "RESTART" for the RESTART key', () => {
        expect(FlowDispatchTypes.RESTART).toBe('RESTART');
    });

    it('has a value of "SET_AUTH_METHOD" for the SET_AUTH_METHOD key', () => {
        expect(FlowDispatchTypes.SET_AUTH_METHOD).toBe('SET_AUTH_METHOD');
    });
})