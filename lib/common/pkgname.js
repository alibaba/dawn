/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

class PkgName {

  constructor(opts) {
    this.opts = Object.assign({}, opts);
  }

  get scope() {
    return this.opts.scope || '';
  }

  get version() {
    return this.opts.version || '';
  }

  get prefix() {
    return this.opts.prefix || '';
  }

  get member() {
    return this.opts.member || '';
  }

  get name() {
    if (this.isPath) return this.shortName;
    const { name = '', prefix = '' } = this.opts;
    return name && prefix && !name.startsWith(prefix) ?
      `${prefix}-${name}` : name;
  }

  get shortName() {
    const { name = '', prefix = '' } = this.opts;
    return name && prefix && name.startsWith(prefix) ?
      name.replace(prefix, '') : name;
  }

  get fullName() {
    const { scope, name } = this;
    return scope && name ? `${scope}/${name}` : name;
  }

  get fullNameAndVersion() {
    const { fullName = '', version = '' } = this;
    return fullName && version ? `${fullName}@${version}` : fullName;
  }

  get isPath() {
    return !!this.opts.isPath;
  }

  toString() {
    const { fullNameAndVersion, member } = this;
    return member ? `${fullNameAndVersion} ${member}` : fullNameAndVersion;
  }

}

const SCOPE_REGEXP = /^(@\S+?)\//i;
const VERSION_REGEXP = /\S+?@(\S+)\s*/i;
const MEMBER_REGEXP = /\s(\S+)$/i;

function isPath(str) {
  if (!str) return false;
  return str.startsWith('.') ||
    str.startsWith('/') ||
    /^[a-z]+\:/i.test(str);
}

function parse(str, prefix) {
  str = str || '';
  if (isPath(str)) {
    const member = (MEMBER_REGEXP.exec(str) || [])[1];
    const name = str.replace(MEMBER_REGEXP, '');
    return new PkgName({ name, member, isPath: true });
  } else {
    const scope = (SCOPE_REGEXP.exec(str) || [])[1];
    const version = (VERSION_REGEXP.exec(str) || [])[1];
    const member = (MEMBER_REGEXP.exec(str) || [])[1];
    const name = str.replace(SCOPE_REGEXP, '')
      .split('@')[0].split(' ')[0];
    return new PkgName({ scope, version, member, name, prefix });
  }
}

module.exports = parse;