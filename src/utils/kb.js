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

  isa(spec, abst) {
    return spec === abst || this.getAllAbsts(spec).includes(abst)
  }

  filler(x, ...path) {
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
    if (!(this.concepts[name])) {
      return [name]
    }
    if (!this.absts[name]) {
      const absts = this.concepts[name].absts || []
      const allAbsts = flatmap(absts, abst => this.getAllAbsts(abst));
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