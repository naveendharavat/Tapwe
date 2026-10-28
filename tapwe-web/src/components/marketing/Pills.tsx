import { Box, Icon, type IconName } from '../ui'

export function Pills({ items }: { items: Array<[IconName, string]> }) {
  return (
    <Box className="pills rv">
      {items.map(([icon, label]) => (
        <span key={label}>
          <Icon name={icon} />
          {label}
        </span>
      ))}
    </Box>
  )
}
