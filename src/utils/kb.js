import { removeDuplicates } from './utils';

// polyfill for node testing
const flatmap = (lst, fn) => (
  lst.flatMap ? lst.flatMap(fn) : lst.reduce((res, x) => res.concat(fn(x)), [])
);

class KB {
  constructor({ concepts, diagnoses }) {
    this.concepts = concepts || {};
    this.diagnoses = diagnoses || {}
    this.absts = {}
  }

  lookup(id) {
    return this.concepts[id] || {}
  }

  isa(spec, abst) {
    return spec === abst || this.getAllAbsts(spec).includes(abst)
  }

  filler(x, ...path) {
    return this.pathFiller(x, path)
  }

  pathFiller(x, path) {
    return path.reduce((x, role) => x && this.inheritFiller(x, role), x)
  }

  search(absts = [], slots = {}) {
    return (
      this.removeAbstractions(
        removeDuplicates(
          Object.keys(this.concepts).filter(name => this.satisfies(name, absts, slots))
        )
      )
    )
  }

  toObject(names, roles) {
    // map "roles" such as "parent.age" to parent-age: pathFiller(x, ['parent', 'age'])
    const paths = roles.map(role => role.split('.'))
    const fillerOf = (name) => (
      paths.reduce((obj, path) => ({...obj, [path.join('-')]: this.pathFiller(name, path)}), {})
    )
    return (
      names.reduce((obj, name) => ({...obj, [name]: fillerOf(name)}), {})
    )
  }

  removeAbstractions(lst) {
    return lst.filter(x => !(lst.some(y => x !== y && this.isa(y, x))));
  }

  satisfies(name, absts, slots) {
    return (
      absts.every(abst => this.isa(name, abst))
      && Object.keys(slots).every(role => this.hasFiller(name, role, slots[role]))
    )
  }

  getAllAbsts(name) {
    const concept = this.concepts[name]
    if (!concept) return [name]
    if (!this.absts[name]) {
      const parents = concept.absts || []
      const allAbsts = flatmap(parents, abst => this.getAllAbsts(abst));
      this.absts[name] = [name].concat(removeDuplicates(allAbsts));
    }
    return this.absts[name]
  }

  getFiller(name, role) {
    const concept = this.concepts[name]
    return concept && concept.slots && concept.slots[role]
  }

  inheritFiller(name, role) {
    const abst = this.getAllAbsts(name).find(abst => this.getFiller(abst, role) !== undefined);
    return abst && this.getFiller(abst,role);
  }

  hasFiller(name, role, filler) {
    const x = this.inheritFiller(name, role);
    return x !== undefined && this.isa(x, filler)
  }
}

export default KB;