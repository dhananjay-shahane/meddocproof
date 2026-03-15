# Third-Party Licenses

This document contains attribution notices and license information for third-party software used in this project.

---

## MIT License

The majority of dependencies in this project are licensed under the MIT License, including:

- **Next.js** - © Vercel, Inc.
- **React** - © Meta Platforms, Inc.
- **Tailwind CSS** - © Tailwind Labs, Inc.
- **Framer Motion** - © Framer B.V.
- **Radix UI** - © WorkOS
- **Zod** - © Colin McDonnell
- **React Hook Form** - © React Hook Form
- **date-fns** - © Sasha Koss
- **Axios** - © Matt Zabriskie
- **Recharts** - © Recharts Group
- **bcryptjs** - © Daniel Wirtz
- **jose** - © Filip Skokan
- **Sonner** - © Emil Kowalski
- **clsx** - © Luke Edwards
- **tailwind-merge** - © Dany Castillo

```
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## Apache License 2.0

### Prisma

- **@prisma/client** - © Prisma Data, Inc.
- **@prisma/adapter-pg** - © Prisma Data, Inc.

```
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

---

## Mozilla Public License 2.0 (MPL-2.0)

### LightningCSS

- **lightningcss** - © Parcel Foundation
- Used as a dependency of Tailwind CSS for CSS parsing and transformation.

```
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at https://mozilla.org/MPL/2.0/.
```

**Compliance Note:** MPL-2.0 is a file-level copyleft license. This project uses LightningCSS as an unmodified dependency. No modifications have been made to MPL-licensed source files.

---

## GNU Lesser General Public License v3.0 (LGPL-3.0-or-later)

### Sharp / libvips

- **sharp** - © Lovell Fuller and contributors
- Sharp uses libvips which is licensed under LGPL-3.0-or-later.

```
This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 3 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
Lesser General Public License for more details.
```

**Compliance Note:** Sharp is used as an optional dependency of Next.js for image optimization. The LGPL-licensed components are dynamically linked native binaries. Users retain the right to replace these components with compatible alternatives.

Full license text: https://www.gnu.org/licenses/lgpl-3.0.html

---

## Creative Commons Attribution 4.0 (CC-BY-4.0)

### caniuse-lite

- **caniuse-lite** - Browser compatibility data from [caniuse.com](https://caniuse.com)
- © Alexis Deveria and contributors

```
This work is licensed under the Creative Commons Attribution 4.0 
International License. To view a copy of this license, visit 
http://creativecommons.org/licenses/by/4.0/.
```

**Attribution:** Browser compatibility data provided by [caniuse.com](https://caniuse.com).

---

## ISC License

### Lucide React

- **lucide-react** - © Lucide Contributors

```
ISC License

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

---

## Additional Notices

### Razorpay SDK

- **razorpay** - © Razorpay Software Private Limited
- Licensed under MIT License

---

## Generating Updated License Information

To regenerate license information for all dependencies:

```bash
npx license-checker --csv --out licenses.csv
npx license-checker --summary
```

---

*This file was last updated: March 2026*
