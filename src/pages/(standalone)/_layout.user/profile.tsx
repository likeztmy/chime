import { ProfileCard } from '@/feature/auth/components/profile-card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(standalone)/_layout/user/profile')({
  component: ProfilePage,
  beforeLoad: () => {
    const token = localStorage.getItem('token')
    if (!token) {
      return { redirect_url: '/login' }
    }
  },
})

function ProfilePage() {
  return (
    <div className="w-full lg:max-w-xl">
      <ProfileCard />
    </div>
  )
}
