"use client"; //클라이언트 구성 요소 -> 이벤트 리스너, 후크 사용 가능

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  /**
   *  debouncing
   *  - 사용자가 입력 중지한 후 특정시간 후에만 코드 실행
   *  - 마지막 이벤트로부터 일정 시간(delay)이 경과한 후에 한 번만 호출
   */
  const handleSearch = useDebouncedCallback((term: string) => {
    console.log(`Searching...${term}`);
    const param = new URLSearchParams(searchParams);
    param.set("page", "1");
    if (term) {
      param.set("query", term);
    } else {
      param.delete("query");
    }
    replace(`${pathname}?${param.toString()}`);
  }, 300);

  // debouncing 비교
  // const handleSearch = (term: string) => {
  //   console.log(`Searching...${term}`);
  //   const param = new URLSearchParams(searchParams);
  //   if (term) {
  //     param.set("query", term);
  //   } else {
  //     param.delete("query");
  //   }
  //   replace(`${pathname}?${param.toString()}`);
  // };
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()} //URL과 입력 동기화
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
