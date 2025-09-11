import HTTPBadRequestException from '#exceptions/http_exceptions/http_bad_request_exception'
import HTTPNotFoundException from '#exceptions/http_exceptions/HTTP_not_found_exception'
import Profile from '#models/profile'

export class ProfileService {
  async getById(id: number) {
    const profile = await Profile.findBy('user_id', id)
    if (!profile) throw new HTTPBadRequestException('No profile with this user')

    return profile
  }
  async update(id: number, data: Partial<Profile>) {
    data.user_id = id
    const profile = await Profile.findBy('user_id', id)

    if (!profile) {
      return await Profile.create(data)
    }

    profile.merge(data)
    await profile.save()

    return profile
  }

  async delete(id: number) {
    const profile = await Profile.findBy('user_id', id)
    if (!profile) throw new HTTPNotFoundException('Profile not found')

    await profile.delete()

    return profile
  }
}
