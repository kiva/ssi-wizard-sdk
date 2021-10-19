/**
 * @jest-environment jsdom
 */

import {renderHook, act} from '@testing-library/react-hooks';
import useComponentStore from '../src/hooks/useComponentStore';

describe('The useComponentStore hook', () => {
    describe('sets, gets and resets data correctly', () => {
        const {result} = renderHook(() => useComponentStore('mock'));
        const stringVal: [string, string] = ['test', 'value'];
        const numVal: [string, number] = ['testNumber', 1];
        const objVal: [string, any] = ['testObj', {
            key: 'obj'
        }];

        beforeEach(() => {
            result.current.set(...stringVal);
            result.current.set(...numVal);
            result.current.set(...objVal);
        })
        
        it('can set and retrieve a value for a single step', () => {
            expect(result.current.get(stringVal[0])).toBe(stringVal[1]);

            expect(result.current.get(numVal[0])).toBe(numVal[1]);

            expect(result.current.get(objVal[0])).toEqual(objVal[1]);
        });

        it('can overwrite the value of a key for a single step', () => {
            result.current.set(stringVal[0], 'electric');
            expect(result.current.get(stringVal[0])).not.toBe(stringVal[1]);
            expect(result.current.get(stringVal[0])).toBe('electric');

            result.current.set(numVal[0], 2);
            expect(result.current.get(numVal[0])).not.toBe(numVal[1]);
            expect(result.current.get(numVal[0])).toBe(2);

            result.current.set(objVal[0], {
                completelyDifferentKey: 'geordi'
            });
            expect(result.current.get(objVal[0])).not.toBe(objVal[1]);
            expect(result.current.get(objVal[0])).toEqual({
                completelyDifferentKey: 'geordi'
            });
        });

        it('resets the data when asked to', () => {
            result.current.reset();
            expect(result.current.get(stringVal[0])).toBeUndefined();
            expect(result.current.get(numVal[0])).toBeUndefined();
            expect(result.current.get(objVal[0])).toBeUndefined();
        })
    });

    describe('stores data separately and correctly', () => {
        let res: any;
        const data: any = {
            key: 'arbalest',
            vals: {
                mock: 'infinitus',
                other: 'opusGrande'
            }
        };

        beforeAll(() => {
            let initialStep = 'mock';
            const {result, rerender} = renderHook(() => useComponentStore(initialStep));

            act(() => {
                result.current.set(data.key, data.vals[initialStep]);
            });

            initialStep = 'other';
            rerender();

            act(() => {
                result.current.set(data.key, data.vals[initialStep]);
            });
            res = result;
        });

        it('does not overwrite data set in a different step', () => {
            const mockVal = res.current.get(data.key, 'default', 'mock');
            const otherVal = res.current.get(data.key, 'otherdef', 'other');

            expect(mockVal).toBe(data.vals.mock);
            expect(otherVal).toBe(data.vals.other);
        });

        it('allows access to data from different steps', () => {
            // We expect to be in the 'other' context, rather than 'mock'
            expect(res.current.get(data.key)).toBe(data.vals.other);

            // But we also expect to be able to get that 'mock' data, too
            expect(res.current.get(data.key, 'default', 'mock')).toBe(data.vals.mock);
        });

        it('returns the default value when the key is not found', () => {
            const dfaultKey = 'T\'Plana-Hath';
            expect(res.current.get('missingKey', dfaultKey)).toBe(dfaultKey);
            expect(res.current.get('missingKey', dfaultKey, 'mock')).toBe(dfaultKey);
        });
    });
})