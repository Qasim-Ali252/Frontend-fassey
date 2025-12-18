// src/utils/orderStatusUtils.js

import React from 'react';
import { IoTimeOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline, IoCarOutline, IoCubeOutline } from 'react-icons/io5';

const STATUS_MAP = {
    'pending': { label: 'Payment Pending', icon: IoTimeOutline, class: 'pending' },
    'processing': { label: 'Processing', icon: IoCubeOutline, class: 'processing' },
    'shipped': { label: 'Shipped', icon: IoCarOutline, class: 'shipped' },
    'delivered': { label: 'Delivered', icon: IoCheckmarkCircleOutline, class: 'delivered' },
    'cancelled': { label: 'Cancelled', icon: IoCloseCircleOutline, class: 'cancelled' },
};

export const getStatusClass = (status) => {
    return STATUS_MAP[status?.toLowerCase()]?.class || 'default';
};

export const getStatusIcon = (status) => {
    const Icon = STATUS_MAP[status?.toLowerCase()]?.icon;
    return Icon ? <Icon className="status-icon" /> : null;
};

export const getStatusLabel = (status) => {
    return STATUS_MAP[status?.toLowerCase()]?.label || status;
};