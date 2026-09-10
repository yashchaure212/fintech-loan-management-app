import {
  useMemo,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import { useLogoutMutation } from "@/features/auth/api/authApi";
import PublicSearch from "@/components/marketing/PublicSearch";
import { loanCatalog } from "@/features/loan/data/loanCatalog";

import {
  getUserRole,
} from "./utils/navigationUtils";

import { useNavbarMenus } from "./hooks/useNavbarMenus";
import { useNotifications } from "./hooks/useNotifications";

import NavbarBrand from "./NavbarBrand";
import PublicNavigation from "./PublicNavigation";
import CustomerNavigation from "./CustomerNavigation";
import AdminNavigation from "./AdminNavigation";
import NavbarActions from "./NavbarActions";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    isAuthenticated,
    user,
  } = useSelector(
    (state) => state.auth,
  );

  const [logoutRequest, { isLoading }] =
    useLogoutMutation();

  const {
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
  } = useNavbarMenus();

  const [activeLoanId, setActiveLoanId] =
    useState("school");

  const role = getUserRole(user);

  const isAdmin =
    isAuthenticated &&
    role === "ADMIN";

  const isCustomer =
    isAuthenticated &&
    role === "CUSTOMER";

  const notificationRole = isAdmin
    ? "admin"
    : isCustomer
      ? "customer"
      : "guest";

  const {
    notificationItems,
    unreadCount,
    markAllAsRead,
    markAsRead,
  } = useNotifications(
    notificationRole,
  );

  const activeLoan = useMemo(
    () =>
      loanCatalog.find(
        (loan) =>
          loan.id === activeLoanId,
      ) ||
      loanCatalog[0],
    [activeLoanId],
  );

  const navigateToHash = (hash) => {
    closeMenus();

    if (
      location.pathname === "/"
    ) {
      const id =
        hash.replace("#", "");

      window.history.pushState(
        null,
        "",
        hash,
      );

      window.requestAnimationFrame(
        () => {
          document
            .getElementById(id)
            ?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
        },
      );

      return;
    }

    navigate(`/${hash}`);
  };

  const handleLogout =
    async () => {
      try {
        await logoutRequest().unwrap();
      } catch (error) {
        console.error(
          "Logout error:",
          error,
        );
      } finally {
        toast.success(
          "Logged out successfully",
        );

        closeMenus();

        navigate("/login", {
          replace: true,
        });
      }
    };

  return (
    <>
      <header className="bg-primary sticky top-0 z-50 shadow-[0_2px_12px_rgba(15,23,42,0.10)]">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="flex min-h-[60px] items-center gap-2 px-3 sm:px-5 lg:min-h-[64px] lg:px-8">
            {/* BRAND */}

            <NavbarBrand
              onClick={closeMenus}
            />

            {/* PUBLIC */}

            {!isAuthenticated && (
              <PublicNavigation
                menuRef={menuRef}
                desktopMenu={desktopMenu}
                setDesktopMenu={
                  setDesktopMenu
                }
                activeLoan={activeLoan}
                setActiveLoanId={
                  setActiveLoanId
                }
                navigateToHash={
                  navigateToHash
                }
                closeMenus={
                  closeMenus
                }
              />
            )}

            {/* CUSTOMER */}

            {isCustomer && (
              <CustomerNavigation
                closeMenus={
                  closeMenus
                }
              />
            )}

            {/* ADMIN */}

            {isAdmin && (
              <AdminNavigation
                closeMenus={
                  closeMenus
                }
              />
            )}

            {/* RIGHT */}

            <NavbarActions
              isAuthenticated={
                isAuthenticated
              }
              isAdmin={isAdmin}
              isCustomer={isCustomer}
              user={user}
              searchOpen={
                searchOpen
              }
              setSearchOpen={
                setSearchOpen
              }
              notificationsOpen={
                notificationsOpen
              }
              setNotificationsOpen={
                setNotificationsOpen
              }
              notificationRef={
                notificationRef
              }
              accountOpen={
                accountOpen
              }
              setAccountOpen={
                setAccountOpen
              }
              accountRef={
                accountRef
              }
              notificationItems={
                notificationItems
              }
              unreadCount={
                unreadCount
              }
              markAllAsRead={
                markAllAsRead
              }
              markAsRead={
                markAsRead
              }
              closeMenus={
                closeMenus
              }
              handleLogout={
                handleLogout
              }
              isLoading={isLoading}
            />
          </div>
        </div>
      </header>

      {/* GLOBAL SEARCH */}

      <PublicSearch
        open={searchOpen}
        onOpenChange={
          setSearchOpen
        }
      />
    </>
  );
}

export default Navbar;