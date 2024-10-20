import { Button } from "@/components/ui/button"
import { SunIcon } from "@radix-ui/react-icons"

export function ModeToggle() {
  return (
    <Button variant="ghost" size="icon" aria-label="Toggle theme">
      <SunIcon className="h-[1.2rem] w-[1.2rem]" />
    </Button>
  )
}
