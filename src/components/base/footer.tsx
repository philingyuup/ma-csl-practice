import Link from "next/link";


export default function Footer() {

  return <footer className=" p-3 justify-start">
    
  <p>Questions sourced from&nbsp;
    <Link
      href='https://docs.google.com/spreadsheets/d/1ailexDGmbnN_MZ3V_mtA1kIrxVtF1N2npJThwaF6izw/edit?usp=sharing'
      target='_blank'
      rel='noopener noreferrer'
      className='font-bold text-green-600 relative
        after:bg-green-600 after:absolute after:h-[0.1rem] after:w-0 after:bottom-0
        after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer'
    >
      Google Sheets
    </Link>
    </p>
</footer>
}