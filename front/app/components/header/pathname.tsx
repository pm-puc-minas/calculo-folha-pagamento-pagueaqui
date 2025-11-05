'use client';

import { usePathname } from 'next/navigation';
import { getShowingName } from '../aside/nav-config';

export function ShowPathname() {
  const pathname = usePathname();
  return (
    <>
      <p className="md:text-[22px] text-medium font-semibold text-[#25262B]">
        {getShowingName(pathname)}
      </p>
    </>
  );
}
