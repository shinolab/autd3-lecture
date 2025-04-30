import matplotlib.pyplot as plt
import numpy as np


def plot_silencer_normal():
    ts_index = 5
    num_points = 15

    x = np.arange(num_points)

    y_input = np.ones(num_points) * 2
    y_input[ts_index:] = 6

    y_output = np.ones(num_points) * 2
    y_output[ts_index + 1] = 3
    y_output[ts_index + 2] = 4
    y_output[ts_index + 3] = 5
    y_output[ts_index + 4 :] = 6

    fig, ax = plt.subplots()
    ax.tick_params(direction="in")

    ax.plot(x, y_input, marker="o", linestyle="-", label="Input")
    ax.plot(x, y_output, marker="o", linestyle="-", label="Output")

    ax.set_ylabel("P/E")

    ax.set_ylim(0, 12)
    ax.set_yticks([0, 2, 6, 12])

    ax.set_xlim(0, num_points - 1)

    ax.set_xticks([0, ts_index])
    ax.set_xticklabels(["0", "$t_s$"])

    ax.legend(frameon=False)

    plt.tight_layout()
    plt.savefig("silencer_normal.svg")

    # plt.show()


def plot_silencer_wrap():
    ts_index = 5
    num_points = 15

    x = np.arange(num_points)

    y_input = np.ones(num_points) * 2
    y_input[ts_index:] = 10

    y_output = np.ones(num_points) * 2
    y_output[ts_index + 1] = 1
    y_output[ts_index + 2] = 0
    y_output[ts_index + 3] = 11
    y_output[ts_index + 4 :] = 10

    fig, ax = plt.subplots()
    ax.tick_params(direction="in")

    ax.plot(x, y_input, marker="o", linestyle="-", label="Input")
    ax.plot(x, y_output, marker="o", linestyle="-", label="Output")

    ax.set_ylabel("P")

    ax.set_ylim(0, 12)
    ax.set_yticks([0, 2, 6, 12])

    ax.set_xlim(0, num_points - 1)

    ax.set_xticks([0, ts_index])
    ax.set_xticklabels(["0", "$t_s$"])

    ax.legend(frameon=False)

    plt.tight_layout()
    plt.savefig("silencer_wrap.svg")

    # plt.show()


def plot_silencer_dynamic():
    ts_index = 5
    num_points = 15

    x = np.arange(num_points)

    y_input = np.ones(num_points) * 5
    y_input[ts_index : ts_index + 3] = 15
    y_input[ts_index + 3 :] = 11

    y_output = np.ones(num_points) * 5
    y_output[ts_index + 1] = 7
    y_output[ts_index + 2] = 9
    y_output[ts_index + 3 :] = 11

    y_ma = np.ones(num_points) * 5
    y_ma[ts_index + 1] = 7
    y_ma[ts_index + 2] = 9
    y_ma[ts_index + 3] = 11
    y_ma[ts_index + 4] = 12
    y_ma[ts_index + 5] = 13
    y_ma[ts_index + 6] = 12
    y_ma[ts_index + 7 :] = 11

    fig, ax = plt.subplots()
    ax.tick_params(direction="in")

    ax.plot(x, y_input, marker="o", linestyle="-", label="Input")
    ax.plot(x, y_output, marker="o", linestyle="-", label="Output")
    ax.plot(x, y_ma, marker="o", linestyle="-", label="Moving Average")

    ax.set_ylabel("P/E")

    ax.set_ylim(0, 20)
    ax.set_yticks([0, 5, 11, 15])

    ax.set_xlim(0, num_points - 1)

    ax.set_xticks([0, ts_index])
    ax.set_xticklabels(["0", "$t_s$"])

    ax.legend(frameon=False)

    plt.tight_layout()
    plt.savefig("silencer_dynamic.svg")

    # plt.show()


def plot_silencer_delta():
    ts_index = 5
    num_points = 15

    x = np.arange(num_points)

    y_output = np.ones(num_points) * 2
    y_output[ts_index + 1] = 3
    y_output[ts_index + 2] = 4
    y_output[ts_index + 3] = 5
    y_output[ts_index + 4 :] = 6

    fig, ax = plt.subplots()
    ax.tick_params(direction="in")

    ax.plot(x, y_output, marker="o", linestyle="-")

    ax.set_ylabel("P/E")

    ax.hlines(y=3, xmin=6, xmax=7, color="black", linestyle="--")
    ax.vlines(x=7, ymin=3, ymax=4, color="black", linestyle="--")
    ax.text(7.2, 3.3, "$\Delta$", fontsize=14)

    ax.vlines(x=5, ymin=0, ymax=8, color="black", linestyle="--")
    ax.vlines(x=9, ymin=0, ymax=8, color="black", linestyle="--")
    ax.arrow(
        5,
        6.5,
        4,
        0,
        head_width=0.1,
        head_length=0.4,
        length_includes_head=True,
        color="black",
    )
    ax.arrow(
        9,
        6.5,
        -4,
        0,
        head_width=0.1,
        head_length=0.4,
        length_includes_head=True,
        color="black",
    )
    ax.text(7, 6.8, "$\Delta T$", fontsize=14)

    ax.set_ylim(0, 8)
    ax.set_yticks([0, 2, 4, 6, 8])

    ax.set_xlim(0, num_points - 1)

    plt.tight_layout()
    plt.savefig("silencer_delta.svg")

    # plt.show()


if __name__ == "__main__":
    plot_silencer_normal()
    plot_silencer_wrap()
    plot_silencer_dynamic()
    plot_silencer_delta()
