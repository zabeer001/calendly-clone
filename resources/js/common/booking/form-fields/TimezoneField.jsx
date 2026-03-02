import React, { useId } from 'react';
import Select from 'react-select';
import FieldShell from './FieldShell';

const timezoneOptions = [
    { value: 'Asia/Dhaka', label: 'Asia/Dhaka' },
    { value: 'Asia/Kolkata', label: 'Asia/Kolkata' },
    { value: 'Asia/Karachi', label: 'Asia/Karachi' },
    { value: 'Asia/Singapore', label: 'Asia/Singapore' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo' },
    { value: 'Asia/Dubai', label: 'Asia/Dubai' },
    { value: 'Europe/London', label: 'Europe/London' },
    { value: 'Europe/Berlin', label: 'Europe/Berlin' },
    { value: 'Europe/Paris', label: 'Europe/Paris' },
    { value: 'Europe/Amsterdam', label: 'Europe/Amsterdam' },
    { value: 'Europe/Brussels', label: 'Europe/Brussels' },
    { value: 'Europe/Madrid', label: 'Europe/Madrid' },
    { value: 'Europe/Rome', label: 'Europe/Rome' },
    { value: 'Europe/Zurich', label: 'Europe/Zurich' },
    { value: 'Europe/Vienna', label: 'Europe/Vienna' },
    { value: 'Europe/Stockholm', label: 'Europe/Stockholm' },
    { value: 'Europe/Copenhagen', label: 'Europe/Copenhagen' },
    { value: 'Europe/Oslo', label: 'Europe/Oslo' },
    { value: 'Europe/Helsinki', label: 'Europe/Helsinki' },
    { value: 'Europe/Warsaw', label: 'Europe/Warsaw' },
    { value: 'Europe/Prague', label: 'Europe/Prague' },
    { value: 'Europe/Budapest', label: 'Europe/Budapest' },
    { value: 'Europe/Lisbon', label: 'Europe/Lisbon' },
    { value: 'Europe/Dublin', label: 'Europe/Dublin' },
    { value: 'Europe/Athens', label: 'Europe/Athens' },
    { value: 'Europe/Istanbul', label: 'Europe/Istanbul' },
    { value: 'America/New_York', label: 'America/New_York' },
    { value: 'America/Chicago', label: 'America/Chicago' },
    { value: 'America/Los_Angeles', label: 'America/Los_Angeles' },
    { value: 'America/Denver', label: 'America/Denver' },
    { value: 'America/Toronto', label: 'America/Toronto' },
    { value: 'America/Vancouver', label: 'America/Vancouver' },
    { value: 'America/Sao_Paulo', label: 'America/Sao_Paulo' },
    { value: 'Australia/Sydney', label: 'Australia/Sydney' },
    { value: 'Australia/Melbourne', label: 'Australia/Melbourne' },
];

function toTimezoneEvent(nextValue) {
    return {
        target: {
            name: 'timezone',
            value: nextValue,
        },
    };
}

export default function TimezoneField({ value, onChange }) {
    const inputId = useId();
    const selectedOption =
        timezoneOptions.find((option) => option.value === value) ??
        (value ? { value, label: value } : null);

    const handleChange = (option) => {
        onChange(toTimezoneEvent(option?.value ?? ''));
    };

    return (
        <FieldShell label="Timezone" htmlFor={inputId}>
            <input type="hidden" name="timezone" value={selectedOption?.value ?? ''} />

            <Select
                inputId={inputId}
                instanceId={inputId}
                name="timezone_select"
                options={timezoneOptions}
                value={selectedOption}
                onChange={handleChange}
                isSearchable
                isClearable={false}
                placeholder="Search timezone..."
                noOptionsMessage={() => 'No timezone found'}
                menuPosition="fixed"
                menuPortalTarget={typeof document === 'undefined' ? undefined : document.body}
                unstyled
                classNames={{
                    container: () => 'w-full',
                    control: (state) =>
                        `flex min-h-12 w-full items-center rounded-full border bg-base-100 text-base-content transition-colors ${
                            state.isFocused
                                ? 'border-base-content/30 ring-0'
                                : 'border-base-content/15'
                        }`,
                    valueContainer: () => 'gap-2 px-4 py-2',
                    placeholder: () => 'text-base-content/60',
                    singleValue: () => 'text-base-content',
                    input: () => 'text-base-content',
                    indicatorsContainer: () => 'flex items-center',
                    dropdownIndicator: () =>
                        'cursor-pointer px-5 text-base-content/60 transition-colors hover:text-base-content',
                    indicatorSeparator: () => 'h-5 w-px bg-base-content/10',
                    menu: () =>
                        'z-30 mt-2 overflow-hidden rounded-2xl border border-base-content/10 bg-base-100 shadow-xl',
                    menuList: () => 'max-h-64 p-1',
                    option: (state) =>
                        `cursor-pointer rounded-lg px-3 py-2 text-sm ${
                            state.isSelected
                                ? 'bg-primary text-primary-content'
                                : state.isFocused
                                  ? 'bg-base-200 text-base-content'
                                  : 'text-base-content'
                        }`,
                    noOptionsMessage: () => 'px-3 py-2 text-sm text-base-content/60',
                }}
                styles={{
                    control: (base) => ({
                        ...base,
                        boxShadow: 'none',
                    }),
                    valueContainer: (base) => ({
                        ...base,
                        padding: 0,
                    }),
                    input: (base) => ({
                        ...base,
                        margin: 0,
                        padding: 0,
                        paddingLeft: '0.75rem',
                    }),
                    singleValue: (base) => ({
                        ...base,
                        margin: 0,
                        paddingLeft: '0.75rem',
                    }),
                    placeholder: (base) => ({
                        ...base,
                        margin: 0,
                        paddingLeft: '0.75rem',
                    }),
                    dropdownIndicator: (base) => ({
                        ...base,
                        padding: 0,
                    }),
                    indicatorSeparator: (base) => ({
                        ...base,
                        marginBottom: 0,
                        marginTop: 0,
                    }),
                    menuPortal: (base) => ({
                        ...base,
                        zIndex: 40,
                    }),
                }}
            />
        </FieldShell>
    );
}
