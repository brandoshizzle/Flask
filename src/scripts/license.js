const pjson = require('./../../package.json');
const compV = require('compare-versions');
const request = require('request');
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
    // If they have a legacy project open, go pro
    if (settingsInfo.hasOwnProperty('utility')) {
        if (settingsInfo.utility.legacy) {
            return true;
        }
    }
    // Only parse it if it exists!
    if (licenseString !== null) {
        licenseInfo = JSON.parse(licenseString);
    } else {
        return false;
    }
    // If they don't have a license key, check if it's part of the 14 day trial
    if (licenseInfo.key === null) {
        const now = new Date();
        const installDate = new Date(localStorage.getItem('installDate'));
        let daysLeft = 14 - Math.floor((now.getTime() - installDate.getTime()) / (1000 * 3600 * 24));
        if (daysLeft > 0 && daysLeft < 14) {
            M.toast({ html: `You have ${daysLeft} days left in your FLASK Pro trial!` });
            return true;
        } else if (daysLeft < 0) {
            if (localStorage.getItem('endedTrialNotification') == undefined) {
                $('#post-trial-modal').modal('open');
                localStorage.setItem('endedTrialNotification', 'true');
            }
            return false;
        }
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
    document.getElementById('license-reject-message').innerHTML = message;
    $('#reject-license-modal').modal('open');
}

function acceptLicense(email) {
    $('#license-modal').modal('close');
    $('#accept-license-modal').modal('open');
    licenseInfo = {
        key: licenseKey,
        email: email
    };
    localStorage.setItem('licenseInfo', JSON.stringify(licenseInfo));
}

function weekPurchaseToast() {
    const lastDateStr = localStorage.getItem('lastProNotification');
    const installDateStr = localStorage.getItem('installDate');
    const installDate = new Date(installDateStr);

    if (lastDateStr == undefined) {
        const now = new Date();
        localStorage.setItem('lastProNotification', now.toISOString());
        return;
    }
    const lastDate = new Date(lastDateStr);
    const currentDate = new Date();
    const daysDiff = (currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24);
    if (daysDiff > 14) {
        let installedDays = (currentDate.getTime() - installDate.getTime()) / (1000 * 3600 * 24);
        installedDays = Math.floor(installedDays);
        M.toast({
            html: `<a href="https://www.brandoncathcart.com/flask" style="color:white">You've been using FLASK free for ${installedDays} days now. Consider supporting development by going Pro! <i class="material-icons">launch</i></a>`,
            displayLength: 10000
        });
        localStorage.setItem('lastProNotification', currentDate.toISOString);
    }
}

module.exports = {
    getLocalLicenseInfo: getLocalLicenseInfo,
    doTheyHavePro: doTheyHavePro,
    openModal: openModal,
    validateKey: validateKey,
    weekPurchaseToast: weekPurchaseToast
};
