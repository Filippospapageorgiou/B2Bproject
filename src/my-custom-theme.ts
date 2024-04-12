
import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const myCustomTheme: CustomThemeConfig = {
    name: 'my-custom-theme',
    properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": `system-ui`,
		"--theme-font-family-heading": `system-ui`,
		"--theme-font-color-base": "0 0 0",
		"--theme-font-color-dark": "255 255 255",
		"--theme-rounded-base": "16px",
		"--theme-rounded-container": "8px",
		"--theme-border-base": "1px",
		// =~= Theme On-X Colors =~=
		"--on-primary": "0 0 0",
		"--on-secondary": "0 0 0",
		"--on-tertiary": "0 0 0",
		"--on-success": "255 255 255",
		"--on-warning": "255 255 255",
		"--on-error": "255 255 255",
		"--on-surface": "255 255 255",
		// =~= Theme Colors  =~=
		// primary | #ff97c6 
		"--color-primary-50": "255 239 246", // #ffeff6
		"--color-primary-100": "255 234 244", // #ffeaf4
		"--color-primary-200": "255 229 241", // #ffe5f1
		"--color-primary-300": "255 213 232", // #ffd5e8
		"--color-primary-400": "255 182 215", // #ffb6d7
		"--color-primary-500": "255 151 198", // #ff97c6
		"--color-primary-600": "230 136 178", // #e688b2
		"--color-primary-700": "191 113 149", // #bf7195
		"--color-primary-800": "153 91 119", // #995b77
		"--color-primary-900": "125 74 97", // #7d4a61
		// secondary | #8f48f5 
		"--color-secondary-50": "238 228 254", // #eee4fe
		"--color-secondary-100": "233 218 253", // #e9dafd
		"--color-secondary-200": "227 209 253", // #e3d1fd
		"--color-secondary-300": "210 182 251", // #d2b6fb
		"--color-secondary-400": "177 127 248", // #b17ff8
		"--color-secondary-500": "143 72 245", // #8f48f5
		"--color-secondary-600": "129 65 221", // #8141dd
		"--color-secondary-700": "107 54 184", // #6b36b8
		"--color-secondary-800": "86 43 147", // #562b93
		"--color-secondary-900": "70 35 120", // #462378
		// tertiary | #8be9fd 
		"--color-tertiary-50": "238 252 255", // #eefcff
		"--color-tertiary-100": "232 251 255", // #e8fbff
		"--color-tertiary-200": "226 250 255", // #e2faff
		"--color-tertiary-300": "209 246 254", // #d1f6fe
		"--color-tertiary-400": "174 240 254", // #aef0fe
		"--color-tertiary-500": "139 233 253", // #8be9fd
		"--color-tertiary-600": "125 210 228", // #7dd2e4
		"--color-tertiary-700": "104 175 190", // #68afbe
		"--color-tertiary-800": "83 140 152", // #538c98
		"--color-tertiary-900": "68 114 124", // #44727c
		// success | #50fa7b 
		"--color-success-50": "229 254 235", // #e5feeb
		"--color-success-100": "220 254 229", // #dcfee5
		"--color-success-200": "211 254 222", // #d3fede
		"--color-success-300": "185 253 202", // #b9fdca
		"--color-success-400": "133 252 163", // #85fca3
		"--color-success-500": "80 250 123", // #50fa7b
		"--color-success-600": "72 225 111", // #48e16f
		"--color-success-700": "60 188 92", // #3cbc5c
		"--color-success-800": "48 150 74", // #30964a
		"--color-success-900": "39 123 60", // #277b3c
		// warning | #f1fa8c 
		"--color-warning-50": "253 254 238", // #fdfeee
		"--color-warning-100": "252 254 232", // #fcfee8
		"--color-warning-200": "252 254 226", // #fcfee2
		"--color-warning-300": "249 253 209", // #f9fdd1
		"--color-warning-400": "245 252 175", // #f5fcaf
		"--color-warning-500": "241 250 140", // #f1fa8c
		"--color-warning-600": "217 225 126", // #d9e17e
		"--color-warning-700": "181 188 105", // #b5bc69
		"--color-warning-800": "145 150 84", // #919654
		"--color-warning-900": "118 123 69", // #767b45
		// error | #f26363 
		"--color-error-50": "253 232 232", // #fde8e8
		"--color-error-100": "252 224 224", // #fce0e0
		"--color-error-200": "252 216 216", // #fcd8d8
		"--color-error-300": "250 193 193", // #fac1c1
		"--color-error-400": "246 146 146", // #f69292
		"--color-error-500": "242 99 99", // #f26363
		"--color-error-600": "218 89 89", // #da5959
		"--color-error-700": "182 74 74", // #b64a4a
		"--color-error-800": "145 59 59", // #913b3b
		"--color-error-900": "119 49 49", // #773131
		// surface | #2b2e3b 
		"--color-surface-50": "223 224 226", // #dfe0e2
		"--color-surface-100": "213 213 216", // #d5d5d8
		"--color-surface-200": "202 203 206", // #cacbce
		"--color-surface-300": "170 171 177", // #aaabb1
		"--color-surface-400": "107 109 118", // #6b6d76
		"--color-surface-500": "43 46 59", // #2b2e3b
		"--color-surface-600": "39 41 53", // #272935
		"--color-surface-700": "32 35 44", // #20232c
		"--color-surface-800": "26 28 35", // #1a1c23
		"--color-surface-900": "21 23 29", // #15171d
		
	}
}