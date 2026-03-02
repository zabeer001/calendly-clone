import React from 'react';
import { usePage } from '@inertiajs/react';
import BackendCreateBookingHeader from './BackendCreateBookingHeader';
import FrontendCreateBookingHeader from './FrontendCreateBookingHeader';

export default function CreateBookingHeader() {
    const { props } = usePage();

    if (props.layoutContext === 'backend') {
        return <BackendCreateBookingHeader />;
    }

    return <FrontendCreateBookingHeader />;
}
