import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {{ COMPONENT_NAME }}Layout from './{{ FILE_NAME }}-layout';
import CONST from './const';
import Util from './util';

class {{ COMPONENT_NAME }} extends Component {

    constructor() {
        super();
        this.state = {};
    }

    render() {
        const state = this.state;
        return (
            <{{ COMPONENT_NAME }}Layout />
        );
    }
}

export default {{ COMPONENT_NAME }};
