const toBoolean = (v, def = false) => (v == null ? def : /^(1|true|yes|on)$/i.test(String(v).trim()));

module.exports = toBoolean;
