class Base {
    constructor(main, session, clock) {
        this.main = main
        this.session = session
        this.clock = clock
        this.minUsedOffset = MAX_OFFSET + 1
        this.maxUsedOffset = MIN_OFFSET - 1
    }

    get fullBase() {
        return this.main.concat([this.session], [this.clock])
    }

    get copy(){
        return new Base(this.main.slice(), this.session, this.clock) 
    }

    isEqual(otherBase) {
        if (this.session !== otherBase.session || this.clock !== otherBase.clock || this.main.length !== otherBase.main.length)
            return false
        for (let i = 0; i < this.main.length; ++i)
            if (this.main[i] != otherBase.main[i])
                return false

        return true
    }
}