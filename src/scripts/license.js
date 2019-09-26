const pjson = require('./../../package.json');
const compV = require('compare-versions');
const request = require('request');
let licenseInfo;
let licenseKey;

function getLocalLicenseInfo() {
    const licenseString = localStorage.getItem('licenseInfo');
    // Only parse it if it exists!
    if (licenseString !== null) {
        licenseInfo = JSON.parse(licenseString);
    } else {
        // Doesn't exist, set free license information
        const freeLicenseInfo = {
            key: null,
            email: null
        };
        localStorage.setItem('licenseInfo', JSON.stringify(freeLicenseInfo));
        licenseInfo = freeLicenseInfo;
    }
    document.getElementById('about-license-type').innerText = licenseInfo.key
        ? `Pro License (${licenseInfo.key})`
        : 'Free License';
    document.getElementById('about-license-to').innerHTML = licenseInfo.email ? `Licensed to ${licenseInfo.email}` : '';
    return 'License info gotten.';
}

function doTheyHavePro() {
    const licenseString = localStorage.getItem('licenseInfo');
    // Only parse it if it exists!
    if (licenseString !== null) {
        licenseInfo = JSON.parse(licenseString);
    } else {
        return false;
    }
    console.log(licenseInfo);
    if (licenseInfo.key === null) {
        return false;
    }
    return true;
}

function openModal() {
    M.Sidenav.getInstance($('.sidenav')).close();
    $('#license-modal').modal('open');
}

function validateKey() {
    $('#verify-license-modal').modal('open');

    licenseKey = document.getElementById('enter-license').value;
    const productKey = 'getflask';
    if (licenseKey == '') {
        return;
    }
    var dataString = `product_permalink=${productKey}&license_key=${licenseKey}`;

    var options = {
        url: 'https://api.gumroad.com/v2/licenses/verify',
        method: 'POST',
        body: dataString
    };

    function callback(error, response, body) {
        $('#verify-license-modal').modal('close');
        if (!error && response.statusCode == 200) {
            licenseResponse = JSON.parse(body);
            if (licenseResponse.success === true) {
                if (licenseResponse.refunded === true || licenseResponse.chargebacked === true) {
                    rejectLicense(
                        'Sorry! This license was refunded or charged back. Please contact cathcart.brandon@gmail.com if this is in error.'
                    );
                } else {
                    // LICENSE SUCCESS!
                    console.log(licenseResponse);
                    acceptLicense(licenseResponse.purchase.email);
                }
            } else {
                console.log(body);
                rejectLicense(
                    'Sorry! It looks like your license key isn\'t valid for this version of FLASK. Please try again or contact cathcart.brandon@gmail.com if this is in error.'
                );
            }
        } else {
            console.log(error);
            if (error) {
                rejectLicense(error);
            } else {
                var jsonbody = JSON.parse(body);
                rejectLicense(
                    `We got this message from our license server: "${
                        jsonbody.message
                    }"<br>Please try again or contact cathcart.brandon@gmail.com if this is in error.`
                );
                console.log(body);
            }
        }
    }

    request(options, callback);
}

function rejectLicense(message) {
    // todo: add rejection modal
    document.getElementById('license-reject-message').innerHTML = message;
    $('#reject-license-modal').modal('open');
}

function acceptLicense(email) {
    // todo: add rejection modal
    $('#accept-license-modal').modal('open');
    licenseInfo = {
        key: licenseKey,
        email: email
    };
    localStorage.setItem('licenseInfo', JSON.stringify(licenseInfo));
}

module.exports = {
    getLocalLicenseInfo: getLocalLicenseInfo,
    doTheyHavePro: doTheyHavePro,
    openModal: openModal,
    validateKey: validateKey
};
