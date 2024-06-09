export function generatePattern(fragment: string) {
	const splitFragment = fragment.split("")
	const patternFragments = []

	splitFragment.forEach((v, i, arr) => {
		if (i === splitFragment.length - 1) {
			const prefix = arr.slice(0, i).join("")
			patternFragments.push(`${prefix}[!${v}]*`)
			return
		}

		const prefix = arr.slice(0, i).join("")
		patternFragments.push(prefix + v)
		patternFragments.push(`${prefix}[!${v}]*`)
	})

	patternFragments.push(`${fragment}?*`)

	return `{${patternFragments.join()}}`
}
