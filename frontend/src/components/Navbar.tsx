import { ThemeController } from "./ThemeController";

const Navbar = () => {
  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <a
              href="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-12 rounded-lg bg-primary/10 p-2 flex items-center justify-center">
                <img src="/vite.svg" alt="logo" />
              </div>
              <h1 className="text-lg font-bold">Chat App</h1>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <ThemeController/>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
