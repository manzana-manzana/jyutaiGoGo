import { Pressable, Platform } from 'react-native';
import { openBrowserAsync } from 'expo-web-browser';

export function ExternalLink({
                                 href,
                                 children,
                             }: {
    href: string;
    children: React.ReactNode;
}) {
    const handlePress = async () => {
        if (Platform.OS === 'web') {
            window.open(href, '_blank');
        } else {
            await openBrowserAsync(href);
        }
    };

    return (
        <Pressable onPress={handlePress}>
            {children}
        </Pressable>
    );
}

// import { Link } from 'expo-router';
// import { openBrowserAsync } from 'expo-web-browser';
// import { type ComponentProps } from 'react';
// import { Pressable, Platform } from 'react-native';
//
// type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string };
//
// export function ExternalLink({ href, ...rest }: Props) {
//   return (
//     <Link
//       target="_blank"
//       {...rest}
//       href={href}
//       onPress={async (event) => {
//         if (Platform.OS !== 'web') {
//           // Prevent the default behavior of linking to the default browser on native.
//           event.preventDefault();
//           // Open the link in an in-app browser.
//           await openBrowserAsync(href);
//         }
//       }}
//     />
//   );
// }
