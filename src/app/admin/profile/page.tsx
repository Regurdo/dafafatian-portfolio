'use client';
import { useEffect, useState } from 'react';
import type { Profile } from '@/lib/supabase';
import { deleteImageByUrl, insertRow, updateRow } from '@/lib/admin-queries';
import { useRows } from '@/components/admin/hooks';
import ImageUpload from '@/components/admin/ImageUpload';
import {
  Button,
  Card,
  ErrorBanner,
  Field,
  LoadingBlock,
  SectionHeader,
  TextArea,
  TextInput,
  cleanUrl,
  emptyToNull,
  useToast,
} from '@/components/admin/ui';

type Form = {
  name: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  github: string;
  linkedin: string;
  twitter: string;
  resume_url: string;
  avatar_url: string | null;
};

const EMPTY: Form = {
  name: '',
  title: '',
  bio: '',
  email: '',
  location: '',
  github: '',
  linkedin: '',
  twitter: '',
  resume_url: '',
  avatar_url: null,
};

export default function ProfilePage() {
  const toast = useToast();
  const { rows, loading, error, reload } = useRows<Profile>('profiles');
  const profile = rows[0] ?? null;
  const [form, setForm] = useState<Form>(EMPTY);
  const [saving, setSaving] = useState(false);

  // Isi form ketika data profil selesai dimuat / dimuat ulang
  useEffect(() => {
    if (!profile) return;
    setForm({
      name: profile.name,
      title: profile.title,
      bio: profile.bio,
      email: profile.email,
      location: profile.location ?? '',
      github: profile.github ?? '',
      linkedin: profile.linkedin ?? '',
      twitter: profile.twitter ?? '',
      resume_url: profile.resume_url ?? '',
      avatar_url: profile.avatar_url,
    });
  }, [profile]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name.trim() || !form.title.trim() || !form.bio.trim() || !form.email.trim()) {
      toast.error('Nama, jabatan, bio, dan email wajib diisi.');
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      title: form.title.trim(),
      bio: form.bio.trim(),
      email: form.email.trim(),
      location: emptyToNull(form.location),
      github: cleanUrl(form.github),
      linkedin: cleanUrl(form.linkedin),
      twitter: cleanUrl(form.twitter),
      resume_url: cleanUrl(form.resume_url),
      avatar_url: form.avatar_url,
    };
    const res = profile
      ? await updateRow<Profile>('profiles', profile.id, payload)
      : await insertRow<Profile>('profiles', payload);
    setSaving(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    if (profile?.avatar_url && profile.avatar_url !== form.avatar_url) {
      await deleteImageByUrl(profile.avatar_url);
    }
    toast.success('Profil disimpan.');
    await reload();
  };

  return (
    <>
      <SectionHeader
        tag="/ 05 — profile"
        title="Profile"
        subtitle="Dipakai di Hero, About, dan Footer website."
        action={
          <Button loading={saving} onClick={save}>
            Simpan perubahan
          </Button>
        }
      />

      {error && <ErrorBanner message={error} onRetry={reload} />}
      {loading && !profile ? (
        <LoadingBlock />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <Card className="h-fit p-6">
            <Field label="Foto profil">
              <ImageUpload
                folder="profile"
                value={form.avatar_url}
                onChange={(url) => set('avatar_url', url)}
                aspect="aspect-square"
                rounded="rounded-full"
              />
            </Field>
          </Card>

          <Card className="space-y-6 p-6 sm:p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Nama *" htmlFor="pr-name">
                <TextInput id="pr-name" value={form.name} onChange={(e) => set('name', e.target.value)} />
              </Field>
              <Field label="Jabatan *" htmlFor="pr-title">
                <TextInput id="pr-title" value={form.title} onChange={(e) => set('title', e.target.value)} />
              </Field>
            </div>

            <Field label="Bio *" htmlFor="pr-bio">
              <TextArea id="pr-bio" rows={5} value={form.bio} onChange={(e) => set('bio', e.target.value)} />
            </Field>

            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Email *" htmlFor="pr-email">
                <TextInput
                  id="pr-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                />
              </Field>
              <Field label="Lokasi" htmlFor="pr-loc">
                <TextInput id="pr-loc" value={form.location} onChange={(e) => set('location', e.target.value)} />
              </Field>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Field label="GitHub" htmlFor="pr-gh">
                <TextInput id="pr-gh" value={form.github} onChange={(e) => set('github', e.target.value)} />
              </Field>
              <Field label="LinkedIn" htmlFor="pr-li">
                <TextInput id="pr-li" value={form.linkedin} onChange={(e) => set('linkedin', e.target.value)} />
              </Field>
              <Field label="Twitter / X" htmlFor="pr-tw">
                <TextInput id="pr-tw" value={form.twitter} onChange={(e) => set('twitter', e.target.value)} />
              </Field>
            </div>

            <Field label="URL CV / Resume" htmlFor="pr-cv" hint="Link ke file PDF (mis. Google Drive).">
              <TextInput id="pr-cv" value={form.resume_url} onChange={(e) => set('resume_url', e.target.value)} />
            </Field>
          </Card>
        </div>
      )}
    </>
  );
}
