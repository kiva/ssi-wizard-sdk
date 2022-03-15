import React, {useState, useContext, useRef} from 'react';
import { Button } from '@material-ui/core';
import {FlowDispatchTypes} from '@kiva/ssirius-react';
import {FingerprintRegistrationProps, FingerprintMap, FingerprintCapture, FpIndex, FingerprintKeyMap} from './interfaces/FingerprintRegistrationInterfaces';

import '../../css/Common.scss';
import './css/FingerprintRegistration.scss';
import TranslationContext from '../../contexts/TranslationContext';
import toast from 'react-hot-toast';

export default function FingerprintRegistration(props: FingerprintRegistrationProps) {
    const t = useContext(TranslationContext);
    const mountDate = new Date();
    const scanning = useRef<boolean>(false);
    const fpKeyMap: FingerprintKeyMap = {
        1: 'right_thumb',
        2: 'right_index',
        3: 'right_middle',
        4: 'right_ring',
        5: 'right_little',
        6: 'left_thumb',
        7: 'left_index',
        8: 'left_middle',
        9: 'left_ring',
        10: 'left_little'
    };
    const [fingerprints, setFingerPrints] = useState<FingerprintMap>(props.store.get('fingerprints', {
        1: createEmptyCaptureObject(),
        2: createEmptyCaptureObject(),
        3: createEmptyCaptureObject(),
        4: createEmptyCaptureObject(),
        5: createEmptyCaptureObject(),
        6: createEmptyCaptureObject(),
        7: createEmptyCaptureObject(),
        8: createEmptyCaptureObject(),
        9: createEmptyCaptureObject(),
        10: createEmptyCaptureObject()
    }));

    function showToast(msg: string, duration: number) {
        toast.error(msg, {duration});
    }

    function createEmptyCaptureObject(): FingerprintCapture {
        return {
            image: '',
            captured: mountDate
        };
    }

    function updateFingerprints(fpCapture: FingerprintCapture, index: number) {
        const updated: FingerprintMap = {
            ...fingerprints,
            [index]: fpCapture
        };

        props.store.set('fingerprints', updated);
        setFingerPrints(updated);
    }

    async function addFingerprintCapture(index: number) {
        try {
            if (scanning.current) throw new Error('Errors.fingerprint.scanInProgress');

            scanning.current = true;
            const image = await props.getFingerprint();
            const captured = new Date();
            updateFingerprints({image, captured}, index);
            scanning.current = false;
        } catch (e: any) {
            if ('Errors.fingerprint.scanInProgress' === e.message) {
                showToast(e.message, 3000);
            } else {
                const fpi = index as FpIndex;
                showToast(t('Errors.fingerprint.scanFailed', {
                    scannedFinger: t(`Fingers.${fpKeyMap[fpi]}_full`)
                }), 7000);
            }
        }
    }

    function clearFingerprintCapture(index: number) {
        updateFingerprints(createEmptyCaptureObject(), index);
    }

    function renderEmptyBox(index: number) {
        return <div className='fingerprint-container' onClick={() => addFingerprintCapture(index)}></div>
    }

    function renderFpBox(fpId: FpIndex) {
        return <div className='fingerprint-container success'><><div onClick={() => clearFingerprintCapture(fpId)} className='clear-fp'>X</div><img alt={fpKeyMap[fpId]} style={{width: '100%'}} src={`data:image;base64,${fingerprints[fpId].image}`} /></></div>
    }

    function createFPContainer() {
        return <div id="fp-images-container">
            {Object.keys(fingerprints).map((id: any, index: number) => {
                const fpId: FpIndex = id;
                return <div key={fpId} id={`finger-id-${fpId}`}>
                    {!!fingerprints[fpId].image ? renderFpBox(fpId) : renderEmptyBox(index + 1)}
                    <p>{t(`Fingers.${fpKeyMap[fpId]}_full`, {
                        finger: t('Fingers.finger')
                    })}</p>
                </div>
            })}
        </div>
    }

    function hasAtLeastOneFP(): boolean {
        return Object.values(fingerprints).some(c => !!c.image);
    }

    function getDependencies() {
        let ret: any = {};
        for (const dependency in props.dependencies) {
            const dep = props.dependencies[dependency];
            for (let i = 0; i < dep.length; i++) {
                const data: any = props.store.get(dep[i], null, dependency);
                if (data === null) continue;
                if ('object' === typeof data) {
                    ret = {
                        ...ret,
                        ...data
                    };
                } else {
                    ret[dep[i]] = data;
                }
            }
        }

        return ret;
    }

    async function handleSubmission(e: any) {
        e.preventDefault();
        const dependencyData = getDependencies();
        if (hasAtLeastOneFP()) {
            try {
                await props.register(fingerprints, dependencyData)
            } catch (e: any) {
                console.log(e);
                showToast(t('Errors.fingerprint.registrationFailed', {
                    msg: e.message
                }), 7000);
            }
        } else {
            showToast(t('Errors.fingerprint.needAtLeastOne'), 5000);
        }
    }

    return <div id="fp-registration-container">
        <p id="instructions">{t('FingerprintRegistration.text.instructions')}</p>
        {createFPContainer()}
        <div className="centered buttonListNew stack together loose">
            <Button
                type="submit"
                disabled={!hasAtLeastOneFP()}
                onClick={(e: any) => handleSubmission(e)}
                onSubmit={(e: any) => handleSubmission(e)}>
                {t('Standard.next')}
            </Button>
            <Button
                className="secondary"
                onClick={() => {
                    props.dispatch({
                        type: FlowDispatchTypes.BACK
                    });
                }}>
                {t('Standard.back')}
            </Button>
        </div>
    </div>
}
