const dollarConvert = (num) => "$"  + (num/1000000).toFixed(1) + " MM";

export default dollarConvert;