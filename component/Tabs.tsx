import React, { useState, useRef, useEffect } from 'react'

type Tab = {
  id: string
  label: string
  content: React.ReactNode
  disabled?: boolean
}

type TabsProps = {
  tabs: Tab[]
  defaultActiveTab?: string
  onTabChange?: (tabId: string) => void
  orientation?: 'horizontal' | 'vertical'
}

export default function Tabs({
  tabs,
  defaultActiveTab,
  onTabChange,
  orientation = 'horizontal'
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id || '')
  const [focusedTab, setFocusedTab] = useState<string | null>(null)
  const tabRefs = useRef<Record<string, HTMLButtonElement>>({})

  useEffect(() => {
    if (defaultActiveTab && tabs.some(tab => tab.id === defaultActiveTab)) {
      setActiveTab(defaultActiveTab)
    }
  }, [defaultActiveTab, tabs])

  const handleTabClick = (tabId: string) => {
    if (tabs.find(tab => tab.id === tabId)?.disabled) return
    
    setActiveTab(tabId)
    onTabChange?.(tabId)
  }

  const handleKeyDown = (event: React.KeyboardEvent, tabId: string) => {
    const currentIndex = tabs.findIndex(tab => tab.id === tabId)
    const enabledTabs = tabs.filter(tab => !tab.disabled)
    const enabledIndex = enabledTabs.findIndex(tab => tab.id === tabId)

    let nextTabId: string | null = null

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        if (enabledIndex < enabledTabs.length - 1) {
          nextTabId = enabledTabs[enabledIndex + 1].id
        } else {
          nextTabId = enabledTabs[0].id
        }
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        if (enabledIndex > 0) {
          nextTabId = enabledTabs[enabledIndex - 1].id
        } else {
          nextTabId = enabledTabs[enabledTabs.length - 1].id
        }
        break
      case 'Home':
        event.preventDefault()
        nextTabId = enabledTabs[0].id
        break
      case 'End':
        event.preventDefault()
        nextTabId = enabledTabs[enabledTabs.length - 1].id
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        handleTabClick(tabId)
        break
    }

    if (nextTabId) {
      setFocusedTab(nextTabId)
      tabRefs.current[nextTabId]?.focus()
    }
  }

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content

  return (
    <div 
      data-cy="tabs"
      style={{
        display: 'flex',
        flexDirection: orientation === 'vertical' ? 'row' : 'column'
      }}
    >
      {/* Tab List */}
      <div
        role="tablist"
        aria-orientation={orientation}
        style={{
          display: 'flex',
          flexDirection: orientation === 'vertical' ? 'column' : 'row',
          borderBottom: orientation === 'horizontal' ? '1px solid #e9ecef' : 'none',
          borderRight: orientation === 'vertical' ? '1px solid #e9ecef' : 'none'
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => {
              if (el) tabRefs.current[tab.id] = el
            }}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-disabled={tab.disabled}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            data-cy={`tab-${tab.id}`}
            onClick={() => handleTabClick(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
            onFocus={() => setFocusedTab(tab.id)}
            onBlur={() => setFocusedTab(null)}
            disabled={tab.disabled}
            style={{
              padding: '12px 16px',
              border: 'none',
              background: 'none',
              cursor: tab.disabled ? 'not-allowed' : 'pointer',
              borderBottom: orientation === 'horizontal' && activeTab === tab.id ? '2px solid #007bff' : 'none',
              borderRight: orientation === 'vertical' && activeTab === tab.id ? '2px solid #007bff' : 'none',
              color: tab.disabled ? '#6c757d' : activeTab === tab.id ? '#007bff' : '#495057',
              fontWeight: activeTab === tab.id ? '600' : '400',
              backgroundColor: activeTab === tab.id ? '#f8f9fa' : 'transparent',
              outline: focusedTab === tab.id ? '2px solid #007bff' : 'none',
              outlineOffset: '-2px',
              transition: 'all 0.2s ease',
              ...(orientation === 'vertical' && {
                textAlign: 'left',
                width: '100%'
              })
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        data-cy="tab-panel"
        style={{
          flex: 1,
          padding: '20px',
          minHeight: orientation === 'vertical' ? '200px' : 'auto'
        }}
      >
        {activeTabContent}
      </div>
    </div>
  )
}
