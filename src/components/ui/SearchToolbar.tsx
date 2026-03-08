import SmartSearch from "./SmartSearch"
import ResourceFilters from "./ResourceFilters"
import ViewSwitcher from "./ViewSwitcher"

interface SearchToolbarProps {
  children?: React.ReactNode
}

const SearchToolbar = ({ children }: SearchToolbarProps) => (
  <div className="flex flex-col max-[475px]:gap-2 min-[475px]:flex-row min-[475px]:items-center gap-2">
    <SmartSearch />
    <div className="flex max-[475px]:justify-between items-center gap-2 shrink-0">
      <ResourceFilters />
      <ViewSwitcher />
      {children}
    </div>
  </div>
)

export default SearchToolbar
