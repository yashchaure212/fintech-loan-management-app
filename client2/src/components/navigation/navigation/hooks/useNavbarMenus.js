import {
  useEffect,
  useRef,
  useState,
} from "react";

export function useNavbarMenus() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [desktopMenu, setDesktopMenu] = useState(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] =
    useState(false);

  const menuRef = useRef(null);
  const notificationRef = useRef(null);
  const accountRef = useRef(null);

  const closeMenus = () => {
    setDesktopMenu(null);
    setNotificationsOpen(false);
    setAccountOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setDesktopMenu(null);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }

      if (
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {
        setAccountOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  useEffect(() => {
    const handleKeyboard = (event) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();

        setSearchOpen(true);
        closeMenus();
      }

      if (event.key === "Escape") {
        closeMenus();
        setSearchOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyboard,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard,
      );
    };
  }, []);

  return {
    searchOpen,
    setSearchOpen,

    desktopMenu,
    setDesktopMenu,

    accountOpen,
    setAccountOpen,

    notificationsOpen,
    setNotificationsOpen,

    menuRef,
    notificationRef,
    accountRef,

    closeMenus,
  };
}