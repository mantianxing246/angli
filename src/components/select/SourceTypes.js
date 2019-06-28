export const sourceTypeIsTrue = {
  methods: {
    sourceTypeIsTrue(isContinuous, provinceId) {
      if (isContinuous === 1 && provinceId === 1) {
        return false
      } else {
        return true
      }
    }
  }
}

export const marketTypeisTrue = {
  methods: {
    marketTypeisTrue(isContinuous, provinceId) {
      if (isContinuous === 1 && provinceId === 1) {
        return false
      } else {
        return true
      }
    }
  }
}
