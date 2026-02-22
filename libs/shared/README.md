# Shared Libraries

This directory contains shared libraries for the investing dashboard application.

## Library Structure

### `libs/shared/ui` - UI Component Library

Reusable UI components and shell layouts.

**Structure:**
```
ui/
├── src/
│   ├── lib/
│   │   └── shell/              # Application shell components
│   │       ├── header/         # Header component
│   │       ├── footer/         # Footer component
│   │       ├── sidebar/        # Navigation sidebar
│   │       └── layout/         # Main layout wrapper
```

**Components:**
- `HeaderComponent` - Application header
- `FooterComponent` - Application footer
- `SidebarComponent` - Navigation sidebar
- `LayoutComponent` - Main layout wrapper

**Tags:** `scope:shared`, `type:ui`

### `libs/shared/utils` - Utilities Library

Shared utility functions and helpers.

**Features:**
- Currency formatting utilities
- Percentage formatting utilities
- Reusable data access functions

**Tags:** `scope:shared`, `type:utils`

## Importing from Shared

```typescript
// Import UI components
import { LayoutComponent, HeaderComponent } from '@shared/ui';

// Import utilities
import { formatCurrency, formatPercentage } from '@shared/utils';
```

## Running unit tests

Run `nx test shared-ui` or `nx test shared-utils` to execute the unit tests.

