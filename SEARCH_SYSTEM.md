# Search System Documentation

## Overview

A comprehensive search system for the Quizlet Clone application that enables users to search both decks and flashcards with multiple interfaces and interaction patterns.

## Components

### 1. SearchService (`lib/search-service.ts`)

**Core search functionality with advanced features:**

- **Multi-type Search**: Searches both decks and flashcards simultaneously
- **Relevance Scoring**: Intelligent scoring based on match type and position
- **Flexible Filtering**: Filter by type, starred items, date ranges, and specific decks
- **Sorting Options**: Sort by relevance, alphabetical order, or date
- **Search Suggestions**: Auto-complete based on existing content
- **Recent Searches**: Client-side storage of search history
- **Pagination**: Supports loading more results with offset/limit

**Key Methods:**
```typescript
// Main search function
search(query: string, options: SearchOptions): Promise<SearchResult>

// Get search suggestions
getSearchSuggestions(query: string, limit: number): Promise<string[]>

// Recent searches management
getRecentSearches(): string[]
saveRecentSearch(query: string): void
clearRecentSearches(): void
```

### 2. SearchPage (`components/search/SearchPage.tsx`)

**Full-featured search page with advanced filtering:**

- **Comprehensive UI**: Full search interface with results display
- **Advanced Filters**: Type filtering, starred-only, sort options
- **Real-time Suggestions**: Dropdown with suggestions and recent searches  
- **Filter Sheet**: Sidebar with detailed search options
- **Pagination**: Load more results functionality
- **URL Integration**: Search query stored in URL parameters
- **Results Display**: Rich cards showing result type, relevance, and context

**Features:**
- Search suggestions dropdown
- Recent searches with clear option
- Filter by result type (all/decks/flashcards)
- Sort by relevance, alphabetical, or date
- Responsive design with mobile support

### 3. SearchWidget (`components/search/SearchWidget.tsx`)

**Compact search component for embedding anywhere:**

- **Lightweight**: Minimal footprint for headers/sidebars
- **Quick Results**: Shows top 5 results in dropdown
- **Customizable**: Configurable placeholder, recent searches, callbacks
- **Auto-navigation**: Direct navigation to results or full search
- **Keyboard Support**: Enter to search, Escape to close

**Props:**
```typescript
interface SearchWidgetProps {
  placeholder?: string
  showRecent?: boolean
  autoFocus?: boolean
  onSelect?: (result: SearchResult) => void
  className?: string
}
```

### 4. CommandPalette (`components/search/CommandPalette.tsx`)

**Global quick-access search with keyboard shortcuts:**

- **Keyboard Activation**: Ctrl+K / Cmd+K to open
- **Keyboard Navigation**: Arrow keys, Enter, Escape
- **Quick Access**: Instant search from anywhere in the app
- **Visual Selection**: Highlighted selection with keyboard navigation
- **Context-aware**: Shows search hints and shortcuts

**Features:**
- Global keyboard shortcut (Ctrl+K / Cmd+K)
- Arrow key navigation through results
- Enter to select, Escape to close
- Visual feedback for selected items
- Keyboard shortcut hints

### 5. In-Deck Search (`components/decks/DeckViewPage.tsx`)

**Contextual search within individual decks:**

- **Real-time Filtering**: Instant filtering of flashcards as you type
- **Search Input**: Integrated search bar in deck view
- **Visual Feedback**: Updated card count and "no results" state
- **Search Icon**: Visual search indicator
- **Clear Search**: Easy reset functionality

**Implementation:**
```typescript
// Search state
const [searchQuery, setSearchQuery] = useState('')

// Filtered results
const filteredCards = flashcards.filter(card => 
  searchQuery === '' || 
  card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
  card.back.toLowerCase().includes(searchQuery.toLowerCase())
)
```

## Search Algorithm

### Relevance Scoring

**Deck Scoring:**
- Title match: 10 points
- Title starts with query: +5 points  
- Description match: 5 points

**Flashcard Scoring:**
- Front (term) match: 8 points
- Front starts with query: +4 points
- Back (definition) match: 6 points
- Starred card: +2 points

### Search Process

1. **Input Processing**: Query trimming and lowercase conversion
2. **Parallel Search**: Simultaneous deck and flashcard searches
3. **Relevance Calculation**: Score assignment based on match type and position
4. **Result Merging**: Combine and sort results by relevance
5. **Filtering**: Apply user-specified filters
6. **Pagination**: Return requested subset with hasMore flag

## Integration Points

### Header Integration

```typescript
// Add to Header.tsx
<Button variant="ghost" size="sm" asChild>
  <Link href="/search">
    <Search className="h-4 w-4" />
  </Link>
</Button>
```

### Global Command Palette

```typescript
// Add to app layout
import CommandPalette, { useCommandPalette } from '@/components/search/CommandPalette'

function App() {
  const { isOpen, close } = useCommandPalette()
  
  return (
    <>
      <Header />
      <main>{children}</main>
      <CommandPalette isOpen={isOpen} onClose={close} />
    </>
  )
}
```

### Deck-specific Search

```typescript
// In deck view components
const [searchQuery, setSearchQuery] = useState('')

// Search input
<Input
  placeholder="Search flashcards..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>

// Filtered display
{flashcards.filter(card => 
  searchQuery === '' || 
  card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
  card.back.toLowerCase().includes(searchQuery.toLowerCase())
).map(card => ...)}
```

## Database Schema Support

The search system works with the existing database schema:

```sql
-- Decks table supports title and description search
SELECT * FROM decks WHERE 
  user_id = $1 AND 
  (LOWER(title) LIKE $2 OR LOWER(description) LIKE $3)

-- Flashcards table supports front/back search  
SELECT * FROM flashcards WHERE 
  deck_id IN (user_deck_ids) AND
  (LOWER(front) LIKE $2 OR LOWER(back) LIKE $3)
```

## Performance Considerations

### Optimizations

- **Debounced Input**: 300ms delay prevents excessive API calls
- **Result Limiting**: Default 20 results with pagination
- **Client-side Filtering**: In-deck search uses local filtering
- **Suggestion Caching**: Recent searches stored locally
- **Database Indexing**: Supports full-text search indexes

### Scalability

- **Pagination**: Supports large result sets
- **Offset/Limit**: Efficient database queries
- **Filter Options**: Reduce search scope
- **Type Filtering**: Search specific content types

## User Experience Features

### Keyboard Shortcuts

- **Ctrl+K / Cmd+K**: Open command palette
- **Arrow Keys**: Navigate results
- **Enter**: Select result or search all
- **Escape**: Close search interfaces

### Visual Feedback

- **Loading States**: Search in progress indicators
- **Empty States**: No results messaging
- **Result Highlighting**: Selected items in command palette
- **Type Badges**: Visual distinction between decks and flashcards

### Mobile Support

- **Responsive Design**: All components work on mobile
- **Touch-friendly**: Tap targets and interactions
- **Sheet Component**: Mobile-optimized filters
- **Keyboard Handling**: Virtual keyboard support

## Future Enhancements

### Potential Improvements

1. **Full-text Search**: PostgreSQL full-text search
2. **Search Analytics**: Track popular searches
3. **Smart Suggestions**: Machine learning recommendations  
4. **Search Shortcuts**: Quick filters and operators
5. **Search History**: User-specific search analytics
6. **Advanced Operators**: Boolean search, quotes, exclusions
7. **Search Highlighting**: Highlight matching text in results
8. **Voice Search**: Speech-to-text integration

### Advanced Features

1. **Saved Searches**: Bookmark complex searches
2. **Search Alerts**: Notify when new content matches
3. **Global Search**: Cross-user public content search
4. **Search Export**: Export search results
5. **Search Sharing**: Share search queries with others

## Testing Scenarios

### Core Functionality

1. **Basic Search**: Simple text queries
2. **Multi-word Search**: Complex queries  
3. **Filter Combinations**: Type + date + starred
4. **Pagination**: Loading additional results
5. **Empty Results**: No matches found

### User Interactions

1. **Keyboard Navigation**: Command palette navigation
2. **Search Suggestions**: Auto-complete behavior
3. **Recent Searches**: History management
4. **Mobile Usage**: Touch interactions
5. **Performance**: Large datasets

### Edge Cases

1. **Special Characters**: Quotes, symbols, unicode
2. **Very Long Queries**: Input limitations
3. **Network Issues**: Offline behavior
4. **Permission Changes**: Deck access updates
5. **Concurrent Usage**: Multiple browser tabs

This comprehensive search system provides multiple ways for users to find their content quickly and efficiently, with both simple and advanced search capabilities that scale with user needs.