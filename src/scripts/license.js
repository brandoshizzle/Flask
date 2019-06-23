const pjson = require('./../../package.json');
const compV = require('compare-versions');
let licenseInfo;

function getLocalLicenseInfo() {
	const licenseString = localStorage.getItem('licenseInfo');
	// Only parse it if it exists!
	if (licenseString !== null) {
		licenseInfo = JSON.parse(licenseString);
	} else {
		// Doesn't exist, set free license information
		const freeLicenseInfo = {
			key: null,
			version: null,
			full_name: null
		};
		localStorage.setItem('licenseInfo', JSON.stringify(freeLicenseInfo));
		licenseInfo = freeLicenseInfo;
	}
	document.getElementById('about-license-type').innerText = licenseInfo.key
		? `v${licenseInfo.version} Pro License`
		: 'Free License';
	document.getElementById('about-license-to').innerHTML = licenseInfo.full_name
		? `Licensed to ${licenseInfo.full_name}`
		: '';
	return 'License info gotten.';
}

async function doTheyHavePro() {
	let cVersion = pjson.version;
	cVersion = cVersion.substring(0, 1);
	if (licenseInfo.version === null) {
		return false;
	}
	if (compV(cVersion, licenseInfo.version) > -1) {
		return true;
	}
	return false;
}

function openModal() {
	M.Sidenav.getInstance($('.sidenav')).close();
	$('#license-modal').modal('open');
}

module.exports = {
	getLocalLicenseInfo: getLocalLicenseInfo,
	doTheyHavePro: doTheyHavePro,
	openModal: openModal
};
