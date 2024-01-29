/*! components.js | Huro | Css Ninja. 2020-2021 */

/* ==========================================================================
Demo Components initialization file
========================================================================== */
import Notyf from "./notyf.min.js";

"use strict";

// export const notyf;

// $(document).ready(function () {

    //Notyf Toasts Configuration
    export const notyf = new Notyf({
        duration: 3000,
        position: {
            x: 'right',
            y: 'bottom',
        },
        types: [
            {
                type: 'warning',
                background: themeColors.warning,
                icon: {
                    className: 'fas fa-hand-paper',
                    tagName: 'i',
                    text: ''
                }
            },
            {
                type: 'info',
                background: themeColors.info,
                icon: {
                    className: 'fas fa-info-circle',
                    tagName: 'i',
                    text: ''
                }
            },
            {
                type: 'primary',
                background: themeColors.primary,
                icon: {
                    className: 'fas fa-car-crash',
                    tagName: 'i',
                    text: ''
                }
            },
            {
                type: 'accent',
                background: themeColors.accent,
                icon: {
                    className: 'fas fa-car-crash',
                    tagName: 'i',
                    text: ''
                }
            },
            {
                type: 'purple',
                background: themeColors.purple,
                icon: {
                    className: 'fas fa-check',
                    tagName: 'i',
                    text: ''
                }
            },
            {
                type: 'blue',
                background: themeColors.blue,
                icon: {
                    className: 'fas fa-check',
                    tagName: 'i',
                    text: ''
                }
            },
            {
                type: 'green',
                background: themeColors.green,
                icon: {
                    className: 'fas fa-check',
                    tagName: 'i',
                    text: ''
                }
            },
            {
                type: 'orange',
                background: themeColors.orange,
                icon: {
                    className: 'fas fa-check',
                    tagName: 'i',
                    text: ''
                }
            }
        ]
    });

    //     $('#success-toast-demo').on('click', function () {
    //         notyf.success('Your changes have been successfully saved!');
    //     })

    //     $('#error-toast-demo').on('click', function () {
    //         notyf.error('Looks like something went wrong, try again later.');
    //     })

    //     $('#info-toast-demo').on('click', function () {
    //         notyf.open({
    //             type: 'info',
    //             message: 'This is some useful information that you might need.'
    //         });
    //     })

    //     $('#warning-toast-demo').on('click', function () {
    //         notyf.open({
    //             type: 'warning',
    //             message: 'Please be careful when driving back to home.'
    //         });
    //     })

    //     $('#purple-toast-demo').on('click', function () {
    //         notyf.open({
    //             type: 'purple',
    //             message: 'This is a nice looking purple toast notification.'
    //         });
    //     })

    //     $('#blue-toast-demo').on('click', function () {
    //         notyf.open({
    //             type: 'blue',
    //             message: 'This is a nice looking blue toast notification.'
    //         });
    //     })

    //     $('#green-toast-demo').on('click', function () {
    //         notyf.open({
    //             type: 'green',
    //             message: 'This is a nice looking green toast notification.'
    //         });
    //     })

    //     $('#orange-toast-demo').on('click', function () {
    //         notyf.open({
    //             type: 'orange',
    //             message: 'This is a nice looking orange toast notification.'
    //         });
    //     })

    //     $('#primary-toast-demo').on('click', function () {
    //         if ($('body').hasClass('is-dark')) {
    //             notyf.open({
    //                 type: 'accent',
    //                 message: 'Please be careful when driving back to home.'
    //             });
    //         } else {
    //             notyf.open({
    //                 type: 'primary',
    //                 message: 'Please be careful when driving back to home.'
    //             });
    //         }